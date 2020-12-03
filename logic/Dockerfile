FROM node:15.3.0-buster
RUN mkdir /app
COPY *.json /app/
COPY src /app/src/
RUN cd /app && \
    npm install && \
    echo "#!/bin/sh" > /init.sh && \
    echo "cd /app" >> /init.sh && \
    echo "npm install" >> /init.sh && \
    echo "npm start" >> /init.sh && \
    chmod +x /init.sh
CMD ["/init.sh"]
