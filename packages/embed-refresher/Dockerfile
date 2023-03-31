FROM node:18-alpine

WORKDIR /opt/build

RUN yarn global add typescript
RUN yarn global add less

COPY . .

RUN yarn install
RUN yarn build

FROM node:18-alpine
LABEL name "embed refresher"
LABEL version "0.0.1"

WORKDIR /usr/refresher

COPY --from=0 /opt/build ./

CMD ["node", "--enable-source-maps", "packages/embed-refresher/dist/refresher.js"]