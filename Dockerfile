FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn 

COPY . .

RUN yarn build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

COPY start.sh .

COPY wait-for.sh .

RUN chmod +x /usr/src/app/start.sh

RUN chmod +x /usr/src/app/wait-for.sh

CMD ["node", "dist/main"]

ENTRYPOINT [ "/usr/src/app/start.sh" ]