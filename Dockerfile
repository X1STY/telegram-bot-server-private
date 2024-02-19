FROM node:18-alpine 
WORKDIR /app

COPY package*.json yarn.lock tsconfig*.json ./

RUN yarn

COPY . .
RUN apk --no-cache add postgresql-client && chmod +x wait-for-pg.sh

RUN yarn prisma generate
RUN yarn build
