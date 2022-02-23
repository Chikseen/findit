#17-alpine3.14

FROM node:16
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
EXPOSE 6080
CMD [ "node", "auth.js" ]