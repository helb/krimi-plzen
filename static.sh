#!/bin/bash
JSFILE=$(wget localhost:3000 -O - | grep meteor_js_resource | sed "s/.*src=\/\"/localhost:3000/;s/\?.*//")
CSSFILE=$(wget localhost:3000 -O - | grep meteor_css_resource | sed "s/.*href=\/\"/localhost:3000/;s/\?.*//")
wget http://localhost:3000/${JSFILE} -O ~/www/static.krimi-plzen.cz/htdocs/js/${JSFILE}
wget http://localhost:3000/${CSSFILE} -O ~/www/static.krimi-plzen.cz/htdocs/css/${CSSFILE}
