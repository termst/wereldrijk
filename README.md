# Wereldrijk

Strategiespel in de browser: verover de wereld, alleen, samen op één telefoon of online met vrienden.

**Spelen:** open `index.html`, of de GitHub Pages-site van deze repository.

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
- `vendor/mqtt.min.js`: MQTT.js 5.16.1 (MIT)
