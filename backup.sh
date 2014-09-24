cd /home/helb/weby/mrt/krimiplzen
URL=`meteor mongo --url www.krimi-plzen.cz`
LOGIN=`echo $URL | sed 's/.*client/client/;s/:.*//'`
PASS=`echo $URL | tr ':' '\n' | sed -n 3p | sed 's/@.*//'`
cd /home/helb/weby/mrt/dump/krimiplzen/
DATEDIR=`date +krimiplzen-%Y-%m-%d_%H-%M`
mkdir $DATEDIR
cd $DATEDIR
mongodump -u $LOGIN -p $PASS -h production-db-a3.meteor.io:27017 -d www_krimi-plzen_cz

