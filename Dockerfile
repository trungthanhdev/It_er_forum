
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 

FROM node:22-alpine AS production

WORKDIR /app
COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist
# COPY to-do-list-6c37a-firebase-adminsdk-rf827-4a22d84aac.json ./to-do-list-6c37a-firebase-adminsdk-rf827-4a22d84aac.json

CMD [ "node", "dist/src/main" ]






