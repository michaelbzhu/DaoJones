FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
EXPOSE 5173
RUN chown -R node /usr/src/app
USER node
CMD ["yarn", "dev"]
