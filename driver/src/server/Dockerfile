FROM node:alpine

RUN apk add --update make gcc g++ python curl git krb5-dev zeromq-dev && \
    npm install zeromq --zmq-external --save && \
    apk del make gcc g++ python curl git krb5-dev

ADD ./package.json package.json
RUN npm install

ADD ./server.js server.js
ADD ./configs.js configs.js
ADD ./webpack.config.js webpack.config.js 
ADD ./www www
ADD ./views views
ADD ./build build
RUN npm run build

LABEL databox.type="driver"

EXPOSE 8080

CMD ["npm","start"]

