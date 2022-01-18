FROM node:9-slim
WORKDIR /app
COPY package*.json /app/
RUN npm install node-gyp
RUN npm i
COPY . /app
EXPOSE 7080
CMD [ "npm", "start" ]