#!/bin/bash

hash npm 2>/dev/null || { echo >&2 "Error: npm not found"; exit 1; }
hash pip 2>/dev/null || { echo >&2 "Error: pip not found"; exit 1; }

source venv/bin/activate &&
pip install --upgrade pip &&
cd krimiplzen &&
pip install -r requirements.txt &&
pip install -r requirements.dev.txt &&
npm install
