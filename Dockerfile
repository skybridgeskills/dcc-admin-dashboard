FROM node:18.12-alpine AS base

WORKDIR /home/node/app

# Install build dependencies
RUN apk add --no-cache python3 make g++ gcc vips-dev vips

COPY . .

RUN npm i -g pnpm
RUN pnpm i
RUN npm rebuild sharp
RUN pnpm build
RUN pnpm typecheck

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

EXPOSE 3000

CMD ["node", "dist/server.js"]
