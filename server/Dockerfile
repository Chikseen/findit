FROM node:16
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
EXPOSE 7080
EXPOSE 7081
CMD [ "node", "server.js" ]