FROM node:14.15-alpine

RUN mkdir /api

WORKDIR /api

ADD package.json yarn.lock /api/

RUN yarn

ADD . /api/

CMD yarn run start