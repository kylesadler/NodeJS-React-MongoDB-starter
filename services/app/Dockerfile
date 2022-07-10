# syntax=docker/dockerfile:1

FROM node:16

# Default value; will be overridden by build_args, if passed
ARG node_env=production

ENV NODE_ENV $node_env

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm i --production

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
