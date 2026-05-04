FROM node:24-alpine
COPY . /app
WORKDIR /app
RUN corepack enable && yarn set version 4.13.0 && yarn install
EXPOSE 3000
CMD ["yarn", "start"]