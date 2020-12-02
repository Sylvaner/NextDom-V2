#!/bin/sh
apt-get update
apt-get install -y curl

#############
# Mosquitto #
#############
#MOSQUITTO_USER="nextdom"
#MOSQUITTO_PASSWORD=$(tr -cd '[:alnum:]' < /dev/urandom | fold -w30 | head -n1)
MOSQUITTO_PASSWORD_FILE="/etc/mosquitto/mosquitto.passwd"
apt-get install -y mosquitto mosquitto-clients
echo "user nextdom
topic readwrite #" > /etc/mosquitto/acl.conf
echo "password_file $MOSQUITTO_PASSWORD_FILE
allow_anonymous false" > /etc/mosquitto/conf.d/security.conf
touch $MOSQUITTO_PASSWORD_FILE
mosquitto_passwd -b $MOSQUITTO_PASSWORD_FILE $MOSQUITTO_USER $MOSQUITTO_PASSWORD
service mosquitto start

##########
# NodeJS #
##########
curl -sL https://deb.nodesource.com/setup_15.x | bash -
apt-get install -y nodejs

###########
# NodeRed #
###########
### Service SystemD ###
echo "[Unit]
Description=NodeRed
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
NotifyAccess=main
ExecStart=/usr/sbin/node-red
Restart=on-failure

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/multi-user.target.wants/node-red
### Service InitD ###
echo "#!/bin/sh
### BEGIN INIT INFO
# Provides:    node-red
# Required-Start:  \$remote_fs \$syslog
# Required-Stop:  \$remote_fs \$syslog
# Default-Start:  2 3 4 5
# Default-Stop:    0 1 6
# Short-Description:  node-red
# Description:
#  Flow manager.
### END INIT INFO

set -e

PIDFILE=/var/run/node-red.pid
DAEMON=/usr/bin/node-red
OPTIONS=\"--max-old-space-size=128 --userDir=/root/.node-red\"
test -x \${DAEMON} || exit 0

umask 022

. /lib/lsb/init-functions

case \"\$1\" in
  start)
    log_daemon_msg \"Starting node-red daemon\" \"node-red\"
    if start-stop-daemon --start --quiet --oknodo --background  --make-pidfile --pidfile \${PIDFILE} --startas /bin/bash -- -c \"exec \${DAEMON} \${OPTIONS} > /var/log/nodered.log 2>&1\"; then
      log_end_msg 0
    else
      log_end_msg 1
    fi
    ;;
  stop)
    log_daemon_msg \"Stopping node-red daemon\" \"node-red\"
    if start-stop-daemon --stop --quiet --oknodo --pidfile \${PIDFILE}; then
      log_end_msg 0
      rm -f \${PIDFILE}
    else
      log_end_msg 1
    fi
    ;;
  status)
    if init_is_upstart; then
      exit 1
    fi
    status_of_proc -p \${PIDFILE} \${DAEMON} node-red && exit 0 || exit \$?
    ;;
  *)
    log_action_msg \"Usage: /etc/init.d/node-red {start|stop|reload|force-reload|restart|try-restart|status}\"
    exit 1
esac
exit 0" > /etc/init.d/node-red
chmod +x /etc/init.d/node-red
service node-red start
sleep 10
service node-red stop
sed -i 's/\/\/credentialSecret/credentialSecret/g' /root/.node-red/settings.js
CREDENTIAL_SECRET=$(tr -cd '[:alnum:]' < /dev/urandom | fold -w30 | head -n1)
sed -i "s/a-secret-key/$CREDENTIAL_SECRET/g" /root/.node-red/settings.js
service node-red start
sleep 10
NODERED_REV=$(curl --silent -X GET -H "Node-RED-API-Version: v2" http://localhost:1880/flows | sed -rn 's/^.*"rev":"(.*)".*/\1/p')
curl --silent -d '{
  "flows": [
    {
      "id":"77777777.777777",
      "type":"mqtt-broker",
      "name":"NextDom Broker",
      "broker":"localhost",
      "port":"1883",
      "clientid":
      "nextdom-nodered",
      "usetls":false,
      "compatmode":false,
      "keepalive":"60",
      "cleansession":true,
      "birthTopic":"",
      "birthQos":"0",
      "birthPayload":"",
      "closeTopic":"",
      "closeQos":"0",
      "closePayload":"",
      "willTopic":"",
      "willQos":"0",
      "willPayload":"",
      "credentials":{
        "user":"'"${MOSQUITTO_USER}"'",
        "password":"'"${MOSQUITTO_PASSWORD}"'"
      }
    }
  ],
  "rev":"'"${NODERED_REV}"'"
}' -H "Content-Type: application/json" -H "Node-RED-API-Version: v2" -H "Node-RED-Deployment-Type: full" -X POST http://localhost:1880/flows > /dev/null

###########
# NextDom #
###########

mkdir -p /etc/nextdom
echo "{
  mqtt: {
    user: '${MOSQUITTO_USER}',
    password: '${MOSQUITTO_PASSWORD}',
    server: 'http://localhost:1883'
  }
}" > /etc/nextdom/config.json
