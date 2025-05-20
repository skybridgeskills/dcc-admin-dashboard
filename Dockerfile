FROM node:18.12-alpine as base

FROM node:18 as builder

WORKDIR /home/node/app

COPY . .

RUN npm i -g pnpm
RUN pnpm i
RUN npm rebuild --platform=linux --arch=x64 sharp
RUN npm rebuild --platform=linux --arch=arm64 sharp

RUN pnpm build

FROM base as runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

WORKDIR /home/node/app
COPY package.json ./

RUN npm i -g pnpm
RUN pnpm i --production
RUN pnpm run build

COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

EXPOSE 3000

CMD ["node", "dist/server.js"]
