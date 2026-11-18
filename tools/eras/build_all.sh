#!/bin/sh
# Rebuild every era into ../../eras/<id>.js
cd "$(dirname "$0")"
for f in eras_*.js; do id=${f#eras_}; id=${id%.js}; node build.js "$id" | grep -E "regions|UNNAMED"; done
