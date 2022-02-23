FROM node:16
WORKDIR /app
COPY package*.json /app/
RUN npm install bcrypt@5.0.1
RUN apt update && apt install -y python
RUN npm install
COPY . /app
EXPOSE 6080
CMD [ "node", "auth.js" ]