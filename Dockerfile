#cai dependencies
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

#build source code
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY to-do-list-6c37a-firebase-adminsdk-rf827-4a22d84aac.json ./to-do-list-6c37a-firebase-adminsdk-rf827-4a22d84aac.json


# COPY .env .env

CMD [ "node", "dist/src/main.js" ]






