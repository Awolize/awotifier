FROM node:22-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
EXPOSE 3000

FROM base as production
ENV NODE_ENV=development
RUN pnpm install 
COPY . .
RUN pnpm run build
CMD ["pnpm", "run", "start"]

FROM base as dev
ENV NODE_ENV=development
RUN pnpm run install
COPY . .
CMD ["pnpm", "run", "dev"]