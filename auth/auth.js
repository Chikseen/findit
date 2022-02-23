'use strict';

const express = require("express");
const app = express();

const port = 6080;
app.listen(port, () => console.log("Connecet with Port: " + port));

app.get("/", (request, response) => {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.json({ status: "succes" });
});