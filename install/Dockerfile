# Docker for install test
FROM debian:buster-slim
RUN apt-get update && apt-get install -y vim procps curl
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash - && \
    apt-get install -y nodejs mosquitto mosquitto-clients
RUN npm install -g --unsafe-perm node-red
COPY install.sh /install.sh
RUN echo "#!/bin/bash" > /init.sh && \
    echo "bash /install.sh" >> /init.sh && \
#    echo "mv /root/.node-red/flows_*_cred.json /tmp/" >> /init.sh && \
#    echo "mv /tmp/flows_*_cred.json /tmp/flows_\$(hostname)_cred.json" >> /init.sh && \
#    echo "mv /root/.node-red/flows_*.json /root/.node-red/flows_\$(hostname).json" >> /init.sh && \
#    echo "mv /tmp/flows_*_cred.json /root/.node-red/" >> /init.sh && \
    echo "exec \$@" >> /init.sh && \
    chmod +x /init.sh
ENTRYPOINT ["/init.sh"]
CMD ["tail", "-f", "/var/log/mosquitto/mosquitto.log", "/var/log/nodered.log"]
