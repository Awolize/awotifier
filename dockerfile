FROM node:18-alpine as base

WORKDIR /src
COPY package*.json /
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production
RUN npm build
COPY . /
CMD ["npm", "run", "start"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . /
CMD ["npm", "run", "dev"]