#!/usr/bin/env node
/*
 Wereldrijk NPC-simulatie. Laadt index.html in headless Chromium, start een spel met een
 menselijke speler (Nederland, doet niets) en laat roundEnd() N keer draaien met een vaste seed.
 De spelcode wordt niet aangepast; declareWar en makePeace worden in de pagina gewrapt.

 Gebruik:
   node tools/sim.js --runs 50 --rounds 40 --seed-start 1 --file index.html
   node tools/sim.js --file /pad/main/index.html --file index.html     (vergelijking, zelfde seeds)
 Opties: --out DIR (standaard sim-out), --quiet (geen regel per run)

 Bestanden zonder setSeed() (oude versies) krijgen een mulberry32-stroom in Math.random met
 dezelfde seed, zodat de uitkomst vergelijkbaar blijft met versies die setSeed() hebben.
*/
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

function parseArgs(argv) {
  const o = { runs: 50, rounds: 40, seedStart: 1, files: [], out: 'sim-out', quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === '--runs') o.runs = +v();
    else if (a === '--rounds') o.rounds = +v();
    else if (a === '--seed-start') o.seedStart = +v();
    else if (a === '--file') o.files.push(v());
    else if (a === '--out') o.out = v();
    else if (a === '--quiet') o.quiet = true;
    else { console.error('Onbekende optie: ' + a); process.exit(2) }
  }
  if (!o.files.length) o.files.push(path.join(__dirname, '..', 'index.html'));
  for (const k of ['runs', 'rounds', 'seedStart']) if (!Number.isFinite(o[k])) { console.error('Ongeldige waarde voor ' + k); process.exit(2) }
  return o;
}

/* Draait in de pagina. */
function inPage({ seed, rounds }) {
  if (typeof setSeed === 'function') setSeed(seed);
  else { // versie zonder seed: vervang Math.random door dezelfde mulberry32-stroom
    let a = seed | 0;
    Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 };
  }
  const T = { decl: 0, peace: 0, durs: [], lastDecl: {}, switches: 0 };
  const origWar = declareWar, origPeace = makePeace;
  declareWar = function (a, t, why) {
    const had = atWar(a, t);
    const r = origWar.apply(this, arguments);
    if (!had && atWar(a, t)) {
      T.decl++;
      const l = T.lastDecl[a];
      if (l && l.t !== t && G.round - l.round <= 3) T.switches++;
      T.lastDecl[a] = { t, round: G.round };
    }
    return r;
  };
  makePeace = function (a, b) {
    const k = pk(a, b), st = G.war[k];
    const r = origPeace.apply(this, arguments);
    if (st != null && !G.war[k]) { T.peace++; T.durs.push(G.round - st); T.ended.add(k) }
    return r;
  };
  PICK = { opts: { maxR: 99, tl: 90 }, diff: 0 };
  beginGame('local', [{ nick: 'T', nation: nIdx('Netherlands') }]);

  const rows = [], otherDurs = [];
  let round35 = null, over = null, warsStartedTotal = 0;
  for (let i = 1; i <= rounds; i++) {
    const before = { ...G.war };
    T.decl = 0; T.peace = 0; T.ended = new Set();
    roundEnd();
    const now = G.war;
    let started = 0;
    for (const k in now) if (!(k in before) || before[k] !== now[k]) started++;
    for (const k in before) if (!(k in now) && !T.ended.has(k)) otherDurs.push(G.round - 1 - before[k]);
    warsStartedTotal += started;
    const s = stats();
    let best = -1, bk = 0, alive = 0;
    for (let n = 0; n < NAT.length; n++) { if (G.N[n].dead) continue; alive++; if (s[n].km > bk) { bk = s[n].km; best = n } }
    const share = bk / WORLD_KM;
    if (round35 == null && share >= .35) round35 = i;
    rows.push({
      round: i, wars: Object.keys(G.war).length, declarations: T.decl, warsStarted: started, peaces: T.peace,
      alliances: Object.keys(G.al).length, trades: Object.keys(G.tr).length, alive,
      biggest: NAT[best].k, biggestShare: +share.toFixed(5)
    });
    for (const d of T.durs) otherDurs.push(d);
    T.durs = [];
    if (G.over) { over = { round: i, winner: NAT[G.over.winner].k, reason: G.over.reason }; break }
  }
  return { rows, over, round35, warsStartedTotal, durs: otherDurs, goalSwitches: T.switches };
}

async function runOne(browser, file, seed, rounds) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('file://' + path.resolve(file), { waitUntil: 'load' });
  const t0 = Date.now();
  const raw = await page.evaluate(inPage, { seed, rounds });
  await ctx.close();
  const R = raw.rows, last = R[R.length - 1] || {};
  const sum = k => R.reduce((s, r) => s + r[k], 0);
  const durs = raw.durs;
  return {
    seed, roundsPlayed: R.length, over: raw.over, round35: raw.round35,
    metrics: {
      declarationsTotal: sum('declarations'),
      declarationsPerRound: R.length ? sum('declarations') / R.length : 0,
      warsStartedTotal: raw.warsStartedTotal,
      warsAvg: R.length ? sum('wars') / R.length : 0,
      warsFinal: last.wars,
      avgWarDuration: durs.length ? durs.reduce((a, b) => a + b, 0) / durs.length : null,
      warsFinished: durs.length,
      peaces: sum('peaces'),
      alliancesFinal: last.alliances,
      tradesFinal: last.trades,
      aliveFinal: last.alive,
      biggestFinal: last.biggest,
      biggestShareFinal: last.biggestShare,
      round35: raw.round35,
      goalSwitches: raw.goalSwitches
    },
    rows: R,
    pageErrors: errors,
    _ms: Date.now() - t0
  };
}

const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const median = a => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2 };
const sd = a => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)) };

const NUM = ['declarationsTotal', 'declarationsPerRound', 'warsStartedTotal', 'warsAvg', 'warsFinal', 'avgWarDuration', 'warsFinished', 'peaces',
  'alliancesFinal', 'tradesFinal', 'aliveFinal', 'biggestShareFinal', 'round35', 'goalSwitches'];

function summarize(runs) {
  const out = {};
  for (const k of NUM) {
    const v = runs.map(r => r.metrics[k]).filter(x => x != null);
    out[k] = v.length ? { n: v.length, mean: mean(v), median: median(v), sd: sd(v) } : { n: 0, mean: null, median: null, sd: null };
  }
  const maxRounds = Math.max(...runs.map(r => r.rows.length));
  const perRound = {};
  for (const k of ['wars', 'declarations', 'peaces', 'alliances', 'trades', 'alive', 'biggestShare']) {
    perRound[k] = [];
    for (let i = 0; i < maxRounds; i++) { const v = runs.filter(r => r.rows[i]).map(r => r.rows[i][k]); perRound[k].push(+mean(v).toFixed(4)) }
  }
  return { runs: runs.length, endedEarly: runs.filter(r => r.over).length, metrics: out, perRoundMean: perRound };
}

const f = (x, d = 3) => x == null ? '-' : Math.abs(x) >= 100 ? x.toFixed(1) : x.toFixed(d);
function table(rows) {
  const w = rows[0].map((_, i) => Math.max(...rows.map(r => String(r[i]).length)));
  return rows.map((r, ri) => r.map((c, i) => i ? String(c).padStart(w[i]) : String(c).padEnd(w[i])).join('  ') + (ri === 0 ? '\n' + w.map(x => '-'.repeat(x)).join('  ') : '')).join('\n');
}

(async () => {
  const o = parseArgs(process.argv.slice(2));
  const seeds = Array.from({ length: o.runs }, (_, i) => o.seedStart + i);
  const browser = await chromium.launch();
  const results = [];
  for (let fi = 0; fi < o.files.length; fi++) {
    const file = o.files[fi], label = 'file' + (fi + 1);
    const dir = path.join(o.out, label);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\n== ${label}: ${file} (${o.runs} runs, ${o.rounds} rondes, seeds ${seeds[0]}..${seeds[seeds.length - 1]})`);
    const runs = [];
    for (const seed of seeds) {
      const r = await runOne(browser, file, seed, o.rounds);
      runs.push(r);
      fs.writeFileSync(path.join(dir, `run-${seed}.json`), JSON.stringify({ file, ...r }, null, 1));
      if (!o.quiet) console.log(`seed ${seed}: rondes ${r.roundsPlayed}, oorlogen ${r.metrics.warsFinal}, verklaringen ${r.metrics.declarationsTotal}, vrede ${r.metrics.peaces}, levend ${r.metrics.aliveFinal}, groot ${r.metrics.biggestFinal} ${(r.metrics.biggestShareFinal * 100).toFixed(1)}%, 35% in ronde ${r.round35 ?? '-'}${r.over ? ', einde: ' + r.over.reason : ''} (${r._ms} ms)${r.pageErrors.length ? ' PAGEERRORS ' + r.pageErrors.length : ''}`);
    }
    const summary = { file, ...summarize(runs) };
    fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(summary, null, 1));
    results.push({ file, runs, summary });
    console.log('\nSamenvatting ' + label + ` (${summary.runs} runs, ${summary.endedEarly} vroeg geeindigd)`);
    console.log(table([['maat', 'n', 'gemiddelde', 'mediaan', 'sd'], ...NUM.map(k => { const m = summary.metrics[k]; return [k, m.n, f(m.mean), f(m.median), f(m.sd)] })]));
  }
  if (results.length === 2) {
    const [A, B] = results;
    let same = 0;
    for (let i = 0; i < seeds.length; i++) if (JSON.stringify([A.runs[i].rows, A.runs[i].over]) === JSON.stringify([B.runs[i].rows, B.runs[i].over])) same++;
    console.log(`\nVergelijking file1 vs file2 (zelfde seeds). Identieke runs: ${same}/${seeds.length}`);
    console.log(table([['maat', 'file1 gem.', 'file2 gem.', 'verschil', 'file1 med.', 'file2 med.'], ...NUM.map(k => {
      const a = A.summary.metrics[k], b = B.summary.metrics[k];
      return [k, f(a.mean), f(b.mean), a.mean == null || b.mean == null ? '-' : f(b.mean - a.mean), f(a.median), f(b.median)];
    })]));
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1) });
