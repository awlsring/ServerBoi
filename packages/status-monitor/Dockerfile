FROM node:18-alpine as build

WORKDIR /opt/build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline

COPY . .

RUN yarn build

FROM node:18-alpine as prod
LABEL name "status monitor"
LABEL version "0.0.1"

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/refresher

EXPOSE 7032

COPY --from=build /opt/build/node_modules ./node_modules
COPY --from=build /opt/build/packages/common/dist ./packages/common/dist
COPY --from=build /opt/build/packages/common/package.json ./packages/common/package.json
COPY --from=build /opt/build/packages/backend-common/dist ./packages/backend-common/dist
COPY --from=build /opt/build/packages/backend-common/package.json ./packages/backend-common/package.json
COPY --from=build /opt/build/packages/ssdk/dist ./packages/ssdk/dist
COPY --from=build /opt/build/packages/ssdk/package.json ./packages/ssdk/package.json
COPY --from=build /opt/build/packages/status-monitor/dist ./packages/status-monitor/dist

CMD ["node", "--enable-source-maps", "packages/status-monitor/dist/main.js"]