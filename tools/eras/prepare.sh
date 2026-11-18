#!/bin/sh
# One-time setup for rebuilding the historical eras:
#  - installs polygon-clipping
#  - downloads the historical borders (github.com/aourednik/historical-basemaps, GPL-3.0)
#  - extracts the 2026 map from index.html into map.json
set -e
cd "$(dirname "$0")"
[ -d node_modules/polygon-clipping ] || npm install --no-save polygon-clipping@0.15.7
[ -d historical-basemaps ] || git clone --depth 1 https://github.com/aourednik/historical-basemaps.git
node -e 'const s=require("fs").readFileSync("../../index.html","utf8");const i=s.indexOf("const MAP=");const j=s.indexOf(";const META=",i);require("fs").writeFileSync("map.json",s.slice(i+10,j))'
echo "Klaar. Bouw een tijdperk met: node build.js ww2   (of ./build_all.sh)"
