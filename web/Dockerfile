FROM node:alpine as development
WORKDIR /web
RUN chown node:node .
USER node
CMD npm install && npm run start

FROM node:alpine as build
WORKDIR /web
COPY package*.json .
RUN npm install

COPY . .
ARG VERSION
ENV REACT_APP_VERSION=$VERSION
RUN npm run build

FROM nginx:mainline-alpine as production
COPY server.conf /etc/nginx/conf.d/nginx.conf

COPY --from=build --chown=nginx:nginx /web/build /usr/share/nginx/html
