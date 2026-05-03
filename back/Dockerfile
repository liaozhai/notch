FROM node:24-alpine
WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
RUN corepack enable
RUN yarn set version stable
RUN yarn
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]