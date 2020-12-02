FROM node:15.3.0-buster
RUN mkdir /app
COPY *.json /app/
RUN cd /app && \
  npm install
COPY src /app/src/
RUN ls /app
RUN echo "#!/bin/sh" > /init.sh && \
  echo "cd /app" >> /init.sh && \
  echo "npm install" >> /init.sh && \
  echo "npm start" >> /init.sh && \
  chmod +x /init.sh
CMD ["/init.sh"]
