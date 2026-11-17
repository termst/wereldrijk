/* Wereldrijk online: a tiny document database on top of public MQTT brokers.
 *
 * It offers the same small API the game used inside Claude (doc().get/set/update/onSnapshot
 * and collection().onSnapshot). Every document is a retained MQTT message, so a player who
 * joins later still receives the latest state. To survive one broker being down, the page
 * connects to several public brokers at once, writes to all of them and keeps the newest
 * version of each document (by a version stamp stored next to the data).
 */
(function () {
  'use strict';
  const tt = (nl, en) => (typeof $t === 'function' ? $t(nl, en) : nl);
  const BROKERS = [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt',
    'wss://test.mosquitto.org:8081/mqtt'
  ];
  try { // ?broker=wss://host:port/path to use your own broker
    const b = new URLSearchParams(location.search).getAll('broker');
    if (b.length) BROKERS.splice(0, BROKERS.length, ...b);
  } catch (e) {}
  const PFX = 'wereldrijk-mp/v1/';

  const clients = [];          // connected mqtt clients
  const cache = new Map();     // path -> {v, d}   (d === null means deleted)
  const subs = new Map();      // filter -> refcount
  const listeners = new Set(); // {test(path), fn(path)}
  let readyP = null;

  const topic = p => PFX + p;
  const matches = (filter, path) => {
    const f = filter.split('/'), p = path.split('/');
    if (f.length !== p.length) return false;
    return f.every((s, i) => s === '+' || s === p[i]);
  };

  function onMessage(t, payload) {
    if (!t.startsWith(PFX)) return;
    const path = t.slice(PFX.length);
    let rec = null;
    if (payload && payload.length) {
      try { rec = JSON.parse(new TextDecoder().decode(payload)); } catch (e) { return; }
      if (!rec || typeof rec.v !== 'number') return;
    } else rec = { v: 0, d: null };
    const cur = cache.get(path);
    if (cur && cur.v >= rec.v) return; // older or duplicate (from another broker)
    cache.set(path, rec);
    for (const l of [...listeners]) if (l.test(path)) { try { l.fn(path); } catch (e) { console.error(e); } }
  }

  function connectOne(url) {
    return new Promise(res => {
      let c;
      try {
        c = mqtt.connect(url, {
          clientId: 'wr_' + Math.random().toString(36).slice(2, 12),
          clean: true, keepalive: 30, reconnectPeriod: 3000, connectTimeout: 8000,
          protocolVersion: 4
        });
      } catch (e) { res(null); return; }
      let first = true;
      c.on('message', onMessage);
      c.on('connect', () => {
        if (!clients.includes(c)) clients.push(c);
        const f = [...subs.keys()].map(topic);
        if (f.length) c.subscribe(f, { qos: 1 });
        if (first) { first = false; res(c); }
      });
      c.on('error', () => {});
      setTimeout(() => { if (first) { first = false; try { c.end(true); } catch (e) {} res(null); } }, 9000);
    });
  }

  function ready() {
    if (readyP) return readyP;
    readyP = new Promise(res => {
      if (typeof mqtt === 'undefined') { res(false); return; }
      let pending = BROKERS.length, done = false;
      BROKERS.forEach(u => connectOne(u).then(c => {
        pending--;
        if (c && !done) { done = true; res(true); }
        else if (!pending && !done) { done = true; readyP = null; res(false); }
      }));
    });
    return readyP;
  }

  function live() { return clients.filter(c => c.connected); }

  function sub(filter) {
    const n = subs.get(filter) || 0;
    subs.set(filter, n + 1);
    if (!n) for (const c of live()) c.subscribe(topic(filter), { qos: 1 });
    return () => {
      const m = (subs.get(filter) || 1) - 1;
      if (m > 0) { subs.set(filter, m); return; }
      subs.delete(filter);
      for (const c of live()) c.unsubscribe(topic(filter));
    };
  }

  function publish(path, rec) {
    const cs = live();
    if (!cs.length) return Promise.reject(new Error(tt('geen verbinding met de server', 'no connection to the server')));
    const msg = JSON.stringify(rec);
    // Apply locally right away so the writer sees its own change instantly.
    onMessage(topic(path), new TextEncoder().encode(msg));
    return Promise.any(cs.map(c => new Promise((res, rej) =>
      c.publish(topic(path), msg, { qos: 1, retain: true }, e => e ? rej(e) : res())
    ))).catch(() => { throw new Error(tt('versturen mislukt', 'sending failed')); });
  }

  const snap = path => {
    const r = cache.get(path);
    const exists = !!(r && r.d != null);
    return { id: path.split('/').pop(), exists, data: () => (exists ? JSON.parse(JSON.stringify(r.d)) : undefined) };
  };

  // Wait for the retained copy of a document (or give up after a short while).
  function fetchDoc(path) {
    return new Promise(res => {
      if (subs.has(path) && cache.has(path)) { res(snap(path)); return; }
      let t1 = null, fin = false;
      const end = () => { if (fin) return; fin = true; listeners.delete(l); un(); res(snap(path)); };
      const l = { test: p => p === path, fn: () => { clearTimeout(t1); t1 = setTimeout(end, 400); } };
      listeners.add(l);
      const un = sub(path);
      setTimeout(end, 3500);
    });
  }

  function nextV(path) {
    const cur = cache.get(path);
    return Math.max(Date.now(), cur ? cur.v + 1 : 0);
  }

  function doc(path) {
    return {
      async get() { await ready(); return fetchDoc(path); },
      async set(data) { await ready(); return publish(path, { v: nextV(path), d: data }); },
      async update(part) {
        await ready();
        let cur = cache.get(path);
        if (!cur || cur.d == null) { await fetchDoc(path); cur = cache.get(path); }
        if (!cur || cur.d == null) throw new Error(tt('document bestaat niet', 'document does not exist'));
        return publish(path, { v: nextV(path), d: Object.assign({}, cur.d, part) });
      },
      onSnapshot(fn, err) {
        let on = true;
        const l = { test: p => p === path, fn: () => on && fn(snap(path)) };
        listeners.add(l);
        const un = sub(path);
        if (cache.has(path)) setTimeout(() => on && fn(snap(path)), 0);
        return () => { on = false; listeners.delete(l); un(); };
      }
    };
  }

  function collection(path) {
    const filter = path + '/+';
    const list = () => ({
      docs: [...cache.keys()].filter(p => matches(filter, p) && cache.get(p).d != null).map(snap)
    });
    return {
      onSnapshot(fn, err) {
        let on = true, t = null;
        const fire = () => { clearTimeout(t); t = setTimeout(() => on && fn(list()), 30); };
        const l = { test: p => matches(filter, p), fn: fire };
        listeners.add(l);
        const un = sub(filter);
        fire();
        return () => { on = false; clearTimeout(t); listeners.delete(l); un(); };
      }
    };
  }

  window.WRNet = { ready, doc, collection, brokers: BROKERS, _setBrokers: list => { BROKERS.length = 0; BROKERS.push(...list); } };
})();
