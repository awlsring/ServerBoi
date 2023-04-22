FROM node:18-alpine as build

WORKDIR /opt/build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline

COPY . .

RUN yarn bootstrap

FROM node:18-alpine as prod
LABEL name "discord embed refresher"
LABEL version "0.0.1"

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/refresher

EXPOSE 7032

COPY --from=build /opt/build/node_modules ./node_modules
COPY --from=build /opt/build/packages/common/dist ./packages/common/dist
COPY --from=build /opt/build/packages/common/package.json ./packages/common/package.json
COPY --from=build /opt/build/packages/discord-common/dist ./packages/discord-common/dist
COPY --from=build /opt/build/packages/discord-common/package.json ./packages/discord-common/package.json
COPY --from=build /opt/build/packages/client/dist ./packages/client/dist
COPY --from=build /opt/build/packages/client/package.json ./packages/client/package.json
COPY --from=build /opt/build/packages/embed-refresher/dist ./packages/embed-refresher/dist

CMD ["node", "--enable-source-maps", "packages/embed-refresher/dist/refresher.js"]