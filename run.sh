#!/bin/sh
export DDP_DEFAULT_CONNECTION_URL="http://ws.krimi-plzen.cz"
export ROOT_URL="http://www.krimi-plzen.cz"

while true; do
    meteor run --settings settings.json --production;
done
