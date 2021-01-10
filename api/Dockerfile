FROM node:14.15-alpine

RUN apk add curl --no-cache

RUN mkdir /api

WORKDIR /api

ADD package.json yarn.lock /api/

RUN yarn

ADD . /api/

RUN yarn run build

CMD yarn start