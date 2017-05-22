#!/bin/sh

set -e;

python3.6 krimiplzen/manage.py test -v 2 &&
./node_modules/.bin/eslint . &&
./node_modules/.bin/stylelint "**/*.scss" &&
.venv/bin/flake8 .
