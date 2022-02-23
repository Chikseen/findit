"use strict";
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const databaseIntegrity = require("./dbhandler/dbinit.js");
const userHandling = require("./dbhandler/userHandling.js");

let pathPreFix = "";
if (fs.existsSync("../localDebug.js")) {
  pathPreFix = ".";
}

databaseIntegrity.init(fs, pathPreFix);

const port = 6080;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => console.log("Connecet with Port: " + port));

// Test to check if online
app.get("/", (request, response) => {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Access-Control-Allow-Origin", "*");

  response.json({ status: "success" });
});

// Create User
app.post("/user/createAccount", async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "application/json");

  response.json(
    await userHandling.createUser(bcrypt, JSON.parse(request.body.data))
  );
});
