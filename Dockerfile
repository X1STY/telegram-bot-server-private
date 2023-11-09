FROM node:18-alpine
WORKDIR /app

COPY package*.json .
COPY yarn.lock .
COPY tsconfig*.json .

RUN yarn

COPY . .
RUN npx prisma generate

RUN yarn build
CMD ["yarn", "start"]
