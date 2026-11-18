# Wereldrijk

Strategiespel in de browser: verover de wereld, alleen, samen op één telefoon of online met vrienden.

**Spelen:** open `index.html`, of de GitHub Pages-site van deze repository.

## Wat zit erin
- Een kalender: je begint op 1 januari 2026 en elke beurt is één maand; in de winter is oorlog in koude landen zwaarder, in de zomer lichter
- Een leger dat bij je bevolking past: werving per maand, maximale legergrootte, tankbemanning en piloten hangen af van je inwoners; wapens zijn duur en kosten onderhoud
- Mobilisatie: in 2026 groeien alle legers (ook van de computer) het eerste jaar nog langzaam
- Onderzoek: drones, precisiebommen, luchtafweer, kruisraketten, bunkerbrekers, stealthbommenwerpers, EMP-raketten, hypersone raketten en de waterstofbom, met een luchtaanval die al die wapens gebruikt
- Vertrouwen: wie een bondgenoot of handelspartner aanvalt, of een verse vrede breekt, wordt door de hele wereld minder vertrouwd
- Computerlanden met karakter: elk land heeft een verborgen karakter van 13 eigenschappen (agressief, vriendelijk, vergevingsgezind, trouw, voorzichtig, hebzuchtig, trots, opportunistisch, achterdochtig, expansief, handelsgericht, woord houden, geduldig). Een eigenschap beslist nooit alleen, maar verschuift de kansen
- Geheugen en plannen: landen onthouden oorlogen, veroverd land en geweigerde hulp (wrok die langzaam slijt). Een land valt niet zomaar aan: het kiest een doel met een reden, trekt een paar maanden troepen samen aan de grens (zichtbaar in het nieuws, rechtsboven en bij het land), stelt soms een ultimatum en verklaart dan pas de oorlog
- Wapenstilstand: na een vredesverdrag volgt ongeveer een jaar wapenstilstand; alleen landen die hun woord weinig waard vinden breken die soms, en dan vertrouwt de wereld ze minder
- Bondgenoten doen echt iets: ze komen je te hulp (hoe zeker staat bij het land), sluiten zich soms aan bij jouw oorlogen, stellen samen aanvallen voor, vragen steun als ze verliezen, sturen geld of soldaten als jij het zwaar hebt en zeggen het verbond op als je ze in de steek laat
- Startsituatie: kies bij het starten (en in de online lobby) tussen een historische start (de echte oorlogen, bondgenoten en handelsverdragen van dat moment) en een gelijke start (niemand in oorlog of verbonden)
- Tik op een land: een blauwe lijn om het land, blauwe ringen om kleine of verre stukken land en pijlen aan de rand van het scherm naar land buiten beeld (tik op een pijl om ernaartoe te gaan)
- Marine: elk niveau reikt verder over zee (ongeveer 600, 1.200, 2.200 en 4.000 km); op niveau 5 bereik je elke kust ter wereld
- Tik op een land om te zien met wie het samenwerkt en met wie het in oorlog is; echte bondgenootschappen en handelsverdragen bij de start
- Nieuws onder kopjes: samenvoegingen en verbonden, oorlog, veroverd land, vrede en diplomatie
- Een kaart met een blauwe gloed om het land heen
- Echte landen, een front dat over de hele grens opschuift, terrein, moreel en oorlogsmoeheid
- Legers per continent. Op de kaart staat bij elk land een compact legerlabel met soldaten, tanks en vliegtuigen; het krimpt en laat details weg (een plusje) als je uitzoomt
- Kernwapens: Kernprogramma, Raketschild, doelwit kiezen op de kaart, radioactieve neerslag en kernmachten die terugslaan
- Onrust: veroverd land moet wennen en kan in opstand komen; laat troepen achter of handhaaf de orde. Alleen zolang je nog in oorlog bent met het oude land gaat het land terug; in vrede wordt een opstand neergeslagen en kost die alleen soldaten. Een land dat van de kaart is geveegd blijft weg: zijn land komt niet meer in opstand
- Gebeurtenissen met keuzes, doelen met beloningen en spionage (sabotage, opstand stoken, technologie stelen)
- Diplomatie, coalities (met waarschuwing), overgave en samengaan van landen
- Op een telefoon staan doelen en oorlogen als twee kleine knoppen in de hoeken; tik erop en de inhoud klapt eronder uit, steeds maar één tegelijk
- Groeigrafiek, geluidseffecten (aan/uit in het menu), Nederlands en Engels

## Tijdperken
In het menu kies je bij **Tijdperk** waar je begint: in 2026 of in een van 15 oorlogen, steeds op het hoogtepunt:
Slag bij Kadesh (1274 v.Chr.), Grieks-Perzische oorlogen (480 v.Chr.), Peloponnesische Oorlog (431 v.Chr.), Punische oorlogen (218 v.Chr.),
Verovering van Gallië (58 v.Chr.), Byzantijns-Perzische oorlog (622), Arabische veroveringen (732), Kruistochten (1140), Mongoolse veroveringen (1279),
Honderdjarige Oorlog (1429), Dertigjarige Oorlog (1629), Zevenjarige Oorlog (1756), Napoleontische oorlogen (1812), Eerste Wereldoorlog (1918) en Tweede Wereldoorlog (1942).

- Elk tijdperk heeft de landen, namen en grenzen van toen (bezet gebied hoort bij de bezetter, dus bijvoorbeeld het grootste Duitsland in 1942), met de bondgenootschappen en oorlogen van die maand
- Je speelt elk land met zijn echte leger en economie; de kalender loopt vanaf die maand verder
- Per moeilijkheid krijg je elk spel een nieuwe willekeurige selectie landen, passend bij hun echte sterkte: Makkelijk de grootmachten, Gemiddeld middelgrote landen, Moeilijk kleine en zwakke landen
- In het menu staan de tijdperken van nieuw naar oud
- Wapens passen bij de tijd: strijdwagens, ruiters, olifanten, ridders, katapulten, kanonnen, Grieks vuur; tanks en vliegtuigen pas in de wereldoorlogen. In het Engels krijgen ze ook de passende namen
- Een tijdperk is ook te openen met `index.html?tijd=ww2` (ids: kadesh, perzen, pelop, punisch, gallie, byzperz, arabisch, kruis, mongolen, honderd, dertig, zeven, napoleon, ww1, ww2)
- Online spelen blijft in hetzelfde tijdperk: wie met een code meedoet, wordt naar het tijdperk van het spel gestuurd
- De kaarten staan in `eras/`; ze worden gemaakt met de scripts in `tools/eras/` uit de historische grenzen van
  [historical-basemaps](https://github.com/aourednik/historical-basemaps) plus eigen correcties per oorlog (`tools/eras/prepare.sh`, daarna `./build_all.sh`)

## Online spelen
Online spelen loopt via gratis openbare MQTT-servers (EMQX, HiveMQ, Mosquitto), die over WebSocket bereikt worden.
Een account is niet nodig. De spelstatus wordt als "retained" bericht opgeslagen, zodat je na het verversen
van de pagina met dezelfde code weer kunt meedoen. De pagina verbindt met alle servers tegelijk en gebruikt
steeds de nieuwste versie, dus het spel blijft werken als één server uitvalt.

Een eigen broker gebruiken: `index.html?broker=wss://jouw-server:poort/mqtt`.

Let op: dit zijn openbare servers. Iedereen die de spelcode kent, kan meekijken.

## Bestanden
- `index.html`: het spel
- `eras/*.js`: de kaarten en landen per tijdperk
- `tools/eras/`: scripts om de tijdperken opnieuw te bouwen
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
