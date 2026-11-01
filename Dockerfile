FROM node:24-slim AS base
RUN npm install -g pnpm@12.14.0
WORKDIR /api
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile

# Compile TypeScript
FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build

# Test runner
FROM deps AS test
COPY tsconfig.json vitest.config.ts ./
COPY intl ./intl
COPY src ./src
CMD ["pnpm", "test"]

# API
FROM base AS runtime
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod
COPY intl ./intl
COPY env/healthcheck.ts ./env/
COPY --from=build /api/dist ./dist
CMD ["node", "dist/index.js"]