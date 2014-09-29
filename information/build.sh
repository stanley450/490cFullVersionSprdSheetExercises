#!/bin/bash

echo "[+] Building all production js files"

for item in build*.js; do
    r.js -o $item optimize=none
done
