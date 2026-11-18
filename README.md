# Wereldrijk

Strategiespel in de browser: verover de wereld, alleen, samen op één telefoon of online met vrienden.

**Spelen:** open `index.html`, of de GitHub Pages-site van deze repository.

## Wat zit erin
- Echte landen, een front dat over de hele grens opschuift, terrein, moreel en oorlogsmoeheid
- Legers per continent, met op de kaart bij elk continent hoeveel soldaten en tanks er staan
- Kernwapens: Kernprogramma, Raketschild, doelwit kiezen op de kaart, radioactieve neerslag en kernmachten die terugslaan
- Onrust: veroverd land moet wennen en kan in opstand komen; laat troepen achter of handhaaf de orde. Een land dat van de kaart is geveegd blijft weg: zijn land komt niet meer in opstand
- Gebeurtenissen met keuzes, doelen met beloningen en spionage (sabotage, opstand stoken, technologie stelen)
- Diplomatie, coalities (met waarschuwing), overgave en samengaan van landen
- Groeigrafiek, geluidseffecten (aan/uit in het menu), Nederlands en Engels

## Online spelen
Online spelen loopt via gratis openbare MQTT-servers (EMQX, HiveMQ, Mosquitto), die over WebSocket bereikt worden.
Een account is niet nodig. De spelstatus wordt als "retained" bericht opgeslagen, zodat je na het verversen
van de pagina met dezelfde code weer kunt meedoen. De pagina verbindt met alle servers tegelijk en gebruikt
steeds de nieuwste versie, dus het spel blijft werken als één server uitvalt.

Een eigen broker gebruiken: `index.html?broker=wss://jouw-server:poort/mqtt`.

Let op: dit zijn openbare servers. Iedereen die de spelcode kent, kan meekijken.

## Bestanden
- `index.html`: het spel
- `net.js`: online-laag (kleine documentdatabase op MQTT)
- `tools/sim.js`: NPC simulatie (zie Simulatie)
- `vendor/mqtt.min.js`: MQTT.js 5.16.1 (MIT)

## Simulatie
Met `tools/sim.js` laat je de NPC's herhaalbaar tegen elkaar spelen en meet je hun gedrag. Het script laadt `index.html` in
headless Chromium (Node + `playwright`), start `beginGame('local', [Nederland])` met `maxR:99`, `diff:0` en roept daarna
`roundEnd()` N keer aan. De speler doet niets. De spelcode wordt niet aangepast: `declareWar` en `makePeace` worden in de pagina gewrapt.

```
node tools/sim.js --runs 50 --rounds 40 --seed-start 1 --file index.html
node tools/sim.js --runs 50 --rounds 40 --file oud/index.html --file index.html   # vergelijking, zelfde seeds
```
Opties: `--runs`, `--rounds`, `--seed-start`, `--file` (herhaalbaar, maximaal 2 voor een vergelijking), `--out` (standaard `sim-out/`, staat in `.gitignore`), `--quiet`.

**Uitvoer.** Per run een JSON (`sim-out/fileN/run-<seed>.json`) met per ronde: lopende oorlogen, oorlogsverklaringen, nieuwe oorlogen
(ook bondgenoten en coalities, die `declareWar` omzeilen), vredesverdragen, bondgenootschappen, handelsverdragen, landen in leven,
grootste land en zijn aandeel van `WORLD_KM`. Per run ook de gemiddelde oorlogsduur (alleen beeindigde oorlogen, in rondes), de ronde waarin
35% gehaald wordt en het aantal doelwitwissels (zelfde land verklaart binnen 3 rondes aan een ander land). `summary.json` en de
tabel op het scherm geven gemiddelde, mediaan en standaarddeviatie over alle runs. Met twee bestanden komt er een vergelijkingstabel en
het aantal runs met identieke uitkomst.

Een run stopt vroeg als het spel eindigt (35% van de wereld of de speler is verslagen). `round35` telt alleen runs die 35% haalden (kolom `n`).

**Seed.** `rnd()` is een seedbare PRNG (mulberry32). De toestand staat in `G.rs`, dus een opgeslagen of online spel gaat verder met dezelfde reeks.
Standaard komt de seed uit `Date.now()` (willekeurig). Vastzetten kan met `index.html?seed=123` of `setSeed(123)` in de console.
`shuffle(a)` is een Fisher-Yates shuffle op `rnd()`. Bestanden zonder `setSeed` (oudere versies) krijgen in `sim.js` dezelfde mulberry32 reeks in
`Math.random`, zodat een oude en nieuwe versie met dezelfde seed vergelijkbaar zijn.

Let op: wijzigt een commit hoeveel keer `rnd()` wordt aangeroepen (bijvoorbeeld de shuffle), dan wijken alle uitkomsten per seed af, ook zonder
regelwijziging. Vergelijk dan op gemiddelden over veel runs, niet per seed.
