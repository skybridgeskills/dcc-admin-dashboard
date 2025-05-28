FROM node:18.12-alpine AS base

FROM node:18 AS builder

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

FROM base AS runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

WORKDIR /home/node/app
COPY package.json ./

# Install build dependencies
RUN apk add --no-cache python3 make g++ gcc

RUN npm i -g pnpm
RUN pnpm i --production
RUN npm rebuild --platform=linuxmusl --arch=arm64v8 sharp

# Clean up build dependencies
RUN apk del python3 make g++ gcc

COPY --from=builder /home/node/app/dist/ ./dist
COPY --from=builder /home/node/app/build/ ./build

EXPOSE 3000
RUN ls -la /home/node/app/dist/
RUN test -f /home/node/app/dist/server.js || echo "MISSING FILE IN FINAL IMAGE"

CMD ["node", "dist/server.js"]
