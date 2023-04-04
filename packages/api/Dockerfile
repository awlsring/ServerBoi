FROM node:18-alpine as build

WORKDIR /opt/build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline

COPY . .

RUN yarn build

FROM node:18-alpine as prod
LABEL name "api"
LABEL version "0.0.1"

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/refresher

COPY --from=build /opt/build/node_modules ./node_modules
COPY --from=build /opt/build/packages/backend-common/dist ./packages/backend-common/dist
COPY --from=build /opt/build/packages/backend-common/package.json ./packages/backend-common/package.json
COPY --from=build /opt/build/packages/ssdk/dist ./packages/ssdk/dist
COPY --from=build /opt/build/packages/ssdk/package.json ./packages/ssdk/package.json
COPY --from=build /opt/build/packages/api/dist ./packages/api/dist

CMD ["node", "--enable-source-maps", "packages/api/dist/idnex.js"]