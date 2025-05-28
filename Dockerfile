FROM node:18.12-alpine as base

FROM node:18 as builder

WORKDIR /home/node/app

COPY . .

RUN npm i -g pnpm
RUN pnpm i
RUN npm rebuild --platform=linux --arch=x64 sharp
RUN npm rebuild --platform=linux --arch=arm64 sharp

RUN pnpm build
RUN pnpm typecheck
RUN ls -la dist/
RUN test -f dist/server.js || echo "server.js NOT FOUND!"

FROM base as runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

WORKDIR /home/node/app
COPY package.json ./

RUN npm i -g pnpm
RUN pnpm i --production

COPY --from=builder /home/node/app/dist/ ./dist
COPY --from=builder /home/node/app/build/ ./build

EXPOSE 3000
RUN ls -la /home/node/app/dist/
RUN test -f /home/node/app/dist/server.js || echo "MISSING FILE IN FINAL IMAGE"

CMD ["node", "dist/server.js"]
