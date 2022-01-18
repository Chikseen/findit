const express = require('express');
const app = express()
const path = require('path');
var fs = require('fs');

var https = require("https");

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/test', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.send("sup")
});

https
    .createServer({
            key: fs.readFileSync(path.join(__dirname, '/cert.key')),
            cert: fs.readFileSync(path.join(__dirname, '/cert.crt')),
        },
        app
    )
    .listen(7080, function() {
        console.log(
            `Example app listening on Port 7080`
        );
    });