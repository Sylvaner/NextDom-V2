FROM debian:buster-slim
RUN apt-get update && apt-get upgrade -y && apt-get install -y wget gnupg
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && \
    ln -s /bin/true /bin/systemctl && \
    apt-get install -y mongodb-org && \
    mkdir -p /data/db
RUN apt-get install -y procps
RUN echo "#!/bin/bash" > /entrypoint.sh && \
    echo "sed -i 's#/var/lib/mongodb#/data/db#g' /etc/mongod.conf" >> /entrypoint.sh && \
    echo "sed -i 's#127.0.0.1#0.0.0.0#g' /etc/mongod.conf" >> /entrypoint.sh && \
    echo "echo \"security:\" >> /etc/mongod.conf" >> /entrypoint.sh && \
    echo "echo \"  authorization: enabled\" >> /etc/mongod.conf" >> /entrypoint.sh && \
    echo "ln -s /nextdomstate /data/db/nextdomstate" >> /entrypoint.sh && \
    echo "mongod --directoryperdb --dbpath /data/db &" >> /entrypoint.sh && \
    echo "MONGO_TEMP_PID=\$!" >> /entrypoint.sh && \ 
    echo "sleep 5" >> /entrypoint.sh && \
    echo "mongo nextdom --eval \"db.createUser({user: '\"\${MONGODB_USER}\"', pwd: '\"\${MONGODB_PASSWORD}\"', roles: [ { role: 'clusterAdmin', db: 'admin' },{ role: 'readAnyDatabase', db: 'admin' },'readWrite']})\"" >> /entrypoint.sh && \
    echo "mongo nextdomstate --eval \"db.createUser({user: '\"\${MONGODB_USER}\"', pwd: '\"\${MONGODB_PASSWORD}\"', roles: [ { role: 'clusterAdmin', db: 'admin' },{ role: 'readAnyDatabase', db: 'admin' },'readWrite']})\"" >> /entrypoint.sh && \
    echo "sleep 5" >> /entrypoint.sh && \
    echo "kill -s KILL \$MONGO_TEMP_PID" >> /entrypoint.sh && \
    echo "exec \$@" >> /entrypoint.sh && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["mongod", "--directoryperdb", "--auth", "-f", "/etc/mongod.conf"]
