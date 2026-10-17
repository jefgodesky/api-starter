FROM node:24-slim

RUN npm install -g pnpm@12.14.0

EXPOSE 8000

WORKDIR /api

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY dist ./dist
COPY env/healthcheck.js ./env/

CMD ["pnpm", "start"]
