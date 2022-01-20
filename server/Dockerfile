FROM node:9-slim
WORKDIR /app
COPY package*.json /app/
RUN npm install bcrypt@3.0.0
#RUN npm install node-gyp
RUN apt update && apt install -y python
RUN npm install
COPY . /app
EXPOSE 7080
CMD [ "npm", "start" ]