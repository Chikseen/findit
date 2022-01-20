FROM node:16-slim
WORKDIR /app
COPY package*.json /app/
RUN npm install bcrypt@5.0.1
RUN apt update && apt install -y python
RUN npm install
COPY . /app
EXPOSE 7080
CMD [ "node", "server.js" ]

#17-alpine3.14