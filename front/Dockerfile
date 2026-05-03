FROM node:24-alpine AS builder
COPY . /app
WORKDIR /app
RUN corepack enable && yarn set version 4.13.0 && yarn install && yarn build

FROM nginx:1.28
COPY --from=builder /app/dist /data/www