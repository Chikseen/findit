#FROM node:lts-alpine
#RUN npm install -g http-server
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build
#EXPOSE 8080
#CMD [ "http-server", "dist" ]

#FROM node:16-alpine AS build
#WORKDIR /app
#COPY package.json ./
#RUN npm install
#COPY . .
#RUN npm run build
#
#FROM nginx:1.19.0-alpine AS prod-stage
#COPY ./nginx_config/nginx.conf /etc/nginx
#EXPOSE 80
#CMD ["nginx" , "-g", "daemon off;"]

FROM node:16.13.2
WORKDIR /app
COPY package*.json /app/
RUN npm install
#COPY ./dist /app/
#RUN npm install express
#RUN npm install connect-history-api-fallback
#RUN npm install path
COPY . /app
RUN npm run build
EXPOSE 80
CMD [ "node", "stream.js" ]

