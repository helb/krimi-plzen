#!/bin/bash
JSFILE=$(wget localhost:$1 -O - | grep meteor_js_resource | sed "s/.*src=\"\///;s/\?.*//")
CSSFILE=$(wget localhost:$1 -O - | grep meteor_css_resource | sed "s/.*href=\"\///;s/\?.*//")
wget -N http://localhost:$1/${JSFILE} -O ~/www/static.krimi-plzen.cz/htdocs/js/${JSFILE}
wget -N http://localhost:$1/${CSSFILE} -O ~/www/static.krimi-plzen.cz/htdocs/css/${CSSFILE}
