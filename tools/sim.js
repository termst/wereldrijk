#!/usr/bin/env node
/*
 Wereldrijk NPC-simulatie. Laadt index.html in headless Chromium, start een spel met een
 menselijke speler en laat roundEnd() N keer draaien met een vaste seed. Zoals in het echte spel
 krijgt de speler elke maand zijn beurt (startTurn: geld en nieuwe soldaten); zonder --bot doet hij verder niets.
 De spelcode wordt niet aangepast; declareWar en makePeace worden in de pagina gewrapt.

 Gebruik:
   node tools/sim.js --runs 50 --rounds 40 --seed-start 1 --file index.html
   node tools/sim.js --file /pad/main/index.html --file index.html     (vergelijking, zelfde seeds)
   node tools/sim.js --era ww1 --bot                                   (tijdperk, speler speelt met de computer-AI)
 Opties: --out DIR (standaard sim-out), --quiet (geen regel per run), --era ID (tijdperk, zie ERA_LIST),
 --nation KEY (speler; standaard Nederland, in een tijdperk het land met het grootste leger), --bot, --diff 0|1|2 (standaard 0)

 Volken zonder staat (w:1 in eras/*.js) tellen niet mee als grootste land en niet voor het aandeel: dat is het
 aandeel van de georganiseerde wereld (WORLD_KM min het land dat volken zonder staat nog hebben). De meting staat los
 van de spelcode, zodat een oude en een nieuwe versie met dezelfde eras/ vergelijkbaar blijven.

 Bestanden zonder setSeed() (oude versies) krijgen een mulberry32-stroom in Math.random met
 dezelfde seed, zodat de uitkomst vergelijkbaar blijft met versies die setSeed() hebben.
*/
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

function parseArgs(argv) {
  const o = { runs: 50, rounds: 40, seedStart: 1, files: [], out: 'sim-out', quiet: false, era: '', nation: '', bot: false, diff: 0 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === '--runs') o.runs = +v();
    else if (a === '--rounds') o.rounds = +v();
    else if (a === '--seed-start') o.seedStart = +v();
    else if (a === '--file') o.files.push(v());
    else if (a === '--out') o.out = v();
    else if (a === '--quiet') o.quiet = true;
    else if (a === '--era') o.era = v();
    else if (a === '--nation') o.nation = v();
    else if (a === '--bot') o.bot = true;
    else if (a === '--diff') o.diff = +v();
    else { console.error('Onbekende optie: ' + a); process.exit(2) }
  }
  if (!o.files.length) o.files.push(path.join(__dirname, '..', 'index.html'));
  for (const k of ['runs', 'rounds', 'seedStart']) if (!Number.isFinite(o[k])) { console.error('Ongeldige waarde voor ' + k); process.exit(2) }
  return o;
}

/* Draait in de pagina. */
function inPage({ seed, rounds, nation, bot, diff }) {
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
  let me = nation ? nIdx(nation) : -1;
  if (me < 0 && !window.ERA) me = nIdx('Netherlands');
  if (me < 0) { let pm = -1; for (let n = 0; n < NAT.length; n++) if (natRegions[n].length && NAT[n].mil > pm) { pm = NAT[n].mil; me = n } }
  PICK = { opts: { maxR: 99, tl: 90 }, diff };
  beginGame('local', [{ nick: 'T', nation: me }]);
  const W = n => !!NAT[n].w && n !== me;   // volk zonder staat (alleen meting)
  // --bot: de speler speelt met de computer-AI (leger, wapens, aanvallen in lopende oorlogen), neemt vrede aan
  // en vraagt zelf om vrede als hij verliest of oorlogsmoe is. Hij begint zelf geen oorlogen.
  const botTurn = h => {
    for (const x of G.offers.filter(x => x.to === h && x.type === 'peace')) if (atWar(x.from, h)) makePeace(x.from, h);
    G.offers = G.offers.filter(x => x.to !== h);
    aiTurn(h);
    let asks = 0;
    for (const e of [...dip().war[h]]) { if (asks >= 2 || G.N[h].dead) break; if (lossFrac(h) > .08 || (G.N[h].we || 0) > 40) { asks++; if (accept(e, h, 'peace', 0)) makePeace(h, e) } }
  };
  const winLine = typeof WIN_SHARE === 'number' ? WIN_SHARE : .35;
  const km0 = stats().map(x => x.km), states0 = [];
  for (let n = 0; n < NAT.length; n++) if (km0[n] > 0 && !W(n)) states0.push(n);

  const rows = [], otherDurs = [];
  let round35 = null, over = null, warsStartedTotal = 0;
  for (let i = 1; i <= rounds; i++) {
    const before = { ...G.war };
    T.decl = 0; T.peace = 0; T.ended = new Set();
    for (const h of G.order) if (!G.N[h].dead) { startTurn(h); if (bot) botTurn(h) }
    roundEnd();
    const now = G.war;
    let started = 0;
    for (const k in now) if (!(k in before) || before[k] !== now[k]) started++;
    for (const k in before) if (!(k in now) && !T.ended.has(k)) otherDurs.push(G.round - 1 - before[k]);
    warsStartedTotal += started;
    const s = stats();
    let best = -1, bk = 0, alive = 0, states = 0, wildKm = 0;
    for (let n = 0; n < NAT.length; n++) {
      if (G.N[n].dead) continue; alive++;
      if (W(n)) { wildKm += s[n].km; continue }
      states++; if (s[n].km > bk) { bk = s[n].km; best = n }
    }
    const org = Math.max(1, WORLD_KM - wildKm), share = bk / org;
    if (round35 == null && share >= winLine) round35 = i;
    rows.push({
      round: i, wars: Object.keys(G.war).length, declarations: T.decl, warsStarted: started, peaces: T.peace,
      alliances: Object.keys(G.al).length, trades: Object.keys(G.tr).length, alive, states,
      biggest: NAT[best].k, biggestShare: +share.toFixed(5), wildShare: +(wildKm / WORLD_KM).toFixed(5),
      playerShare: G.N[me].dead ? 0 : +(s[me].km / org).toFixed(5)
    });
    for (const d of T.durs) otherDurs.push(d);
    T.durs = [];
    if (G.over) { over = { round: i, winner: NAT[G.over.winner].k, reason: G.over.reason }; break }
  }
  // rangcorrelatie (Spearman) tussen land bij de start en aan het eind, over de staten van de start
  const s = stats(), rk = v => { const o = v.map((x, i) => [x, i]).sort((a, b) => b[0] - a[0]), r = new Array(v.length); o.forEach((x, i) => r[x[1]] = i); return r };
  const a = rk(states0.map(n => km0[n])), b = rk(states0.map(n => G.N[n].dead ? 0 : s[n].km)), m = states0.length;
  let d2 = 0; for (let i = 0; i < m; i++) d2 += (a[i] - b[i]) ** 2;
  const rankCorr = m > 2 ? 1 - 6 * d2 / (m * (m * m - 1)) : null;
  const startBig = NAT[states0.reduce((x, n) => km0[n] > km0[x] ? n : x, states0[0])].k;
  return { rows, over, round35, warsStartedTotal, durs: otherDurs, goalSwitches: T.switches, rankCorr, states0: m, startBig, player: NAT[me].k, winLine };
}

async function runOne(browser, file, seed, rounds, o) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('file://' + path.resolve(file) + (o.era ? '?tijd=' + o.era : ''), { waitUntil: 'load' });
  const t0 = Date.now();
  const raw = await page.evaluate(inPage, { seed, rounds, nation: o.nation, bot: o.bot, diff: o.diff });
  await ctx.close();
  const R = raw.rows, last = R[R.length - 1] || {};
  const sum = k => R.reduce((s, r) => s + r[k], 0);
  const durs = raw.durs;
  return {
    seed, roundsPlayed: R.length, over: raw.over, round35: raw.round35, player: raw.player, winLine: raw.winLine,
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
      goalSwitches: raw.goalSwitches,
      statesAliveFrac: raw.states0 ? last.states / raw.states0 : null,
      wildShareFinal: last.wildShare,
      rankCorr: raw.rankCorr,
      startBigStaysBig: last.biggest === raw.startBig ? 1 : 0,
      playerAlive: raw.over && raw.over.reason === 'dood' ? 0 : 1,
      playerShareFinal: last.playerShare
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
  'alliancesFinal', 'tradesFinal', 'aliveFinal', 'biggestShareFinal', 'round35', 'goalSwitches',
  'statesAliveFrac', 'wildShareFinal', 'rankCorr', 'startBigStaysBig', 'playerAlive', 'playerShareFinal'];

function summarize(runs) {
  const out = {};
  for (const k of NUM) {
    const v = runs.map(r => r.metrics[k]).filter(x => x != null);
    out[k] = v.length ? { n: v.length, mean: mean(v), median: median(v), sd: sd(v) } : { n: 0, mean: null, median: null, sd: null };
  }
  const maxRounds = Math.max(...runs.map(r => r.rows.length));
  const wc = {}; for (const r of runs) wc[r.metrics.biggestFinal] = (wc[r.metrics.biggestFinal] || 0) + 1;
  const topWinner = Object.entries(wc).sort((a, b) => b[1] - a[1])[0];
  const perRound = {};
  for (const k of ['wars', 'declarations', 'peaces', 'alliances', 'trades', 'alive', 'states', 'biggestShare', 'wildShare', 'playerShare']) {
    perRound[k] = [];
    for (let i = 0; i < maxRounds; i++) { const v = runs.filter(r => r.rows[i]).map(r => r.rows[i][k]); perRound[k].push(+mean(v).toFixed(4)) }
  }
  return { runs: runs.length, endedEarly: runs.filter(r => r.over).length, winLine: runs[0].winLine, player: runs[0].player,
    topWinner: { k: topWinner[0], frac: topWinner[1] / runs.length }, metrics: out, perRoundMean: perRound };
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
    console.log(`\n== ${label}: ${file}${o.era ? ' tijdperk ' + o.era : ''} (${o.runs} runs, ${o.rounds} rondes, seeds ${seeds[0]}..${seeds[seeds.length - 1]}${o.bot ? ', bot' : ''})`);
    const runs = [];
    for (const seed of seeds) {
      const r = await runOne(browser, file, seed, o.rounds, o);
      runs.push(r);
      fs.writeFileSync(path.join(dir, `run-${seed}.json`), JSON.stringify({ file, ...r }, null, 1));
      if (!o.quiet) console.log(`seed ${seed}: rondes ${r.roundsPlayed}, oorlogen ${r.metrics.warsFinal}, verklaringen ${r.metrics.declarationsTotal}, vrede ${r.metrics.peaces}, levend ${r.metrics.aliveFinal}, groot ${r.metrics.biggestFinal} ${(r.metrics.biggestShareFinal * 100).toFixed(1)}%, winst in ronde ${r.round35 ?? '-'}${r.over ? ', einde: ' + r.over.reason : ''} (${r._ms} ms)${r.pageErrors.length ? ' PAGEERRORS ' + r.pageErrors.length : ''}`);
    }
    const summary = { file, ...summarize(runs) };
    fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(summary, null, 1));
    results.push({ file, runs, summary });
    console.log('\nSamenvatting ' + label + ` (${summary.runs} runs, ${summary.endedEarly} vroeg geeindigd, speler ${summary.player}, winstgrens ${(summary.winLine * 100).toFixed(1)}%, vaakste grootste ${summary.topWinner.k} ${(summary.topWinner.frac * 100).toFixed(0)}%)`);
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
