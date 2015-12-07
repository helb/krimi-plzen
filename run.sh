#!/bin/sh
while true; do
    export DDP_DEFAULT_CONNECTION_URL="http://ws.krimi-plzen.cz"
    #export ROOT_URL="http://www.krimi-plzen.cz"
    meteor run --settings settings.json --production;
done
