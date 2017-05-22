#!/bin/bash

set -e;

hash npm 2>/dev/null || { echo >&2 "Error: npm not found"; exit 1; }
hash pip 2>/dev/null || { echo >&2 "Error: pip not found"; exit 1; }
hash python3.6 2>/dev/null || { echo >&2 "Error: python3.6 not found"; exit 1; }

virtualenv -p `which python3.6` .venv
source .venv/bin/activate &&
pip install --upgrade pip &&
pip install -r requirements.txt &&
pip install -r requirements.dev.txt &&
npm install
