FROM node:15.3.0-buster
RUN mkdir /app
COPY *.json /app/
COPY src /app/src/
RUN cd /app && \
    npm install && \
    npm run build 
RUN ls /app/ && sleep 10

FROM node:15.3.0-buster
COPY --from=0 /app/dist /app/dist
COPY --from=0 /app/node_modules /app/node_modules
RUN ls -al /app && sleep 5
RUN ls -al /app/dist && sleep 5
CMD ["node", "/app/dist/app.js"]
