"use strict";
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const JSONdb = require("simple-json-db");

const databaseIntegrity = require("./dbhandler/dbinit.js");
const userHandling = require("./dbhandler/userHandling.js");

let pathPreFix = "";
if (fs.existsSync("../localDebug.js")) pathPreFix = ".";

databaseIntegrity.init(fs, pathPreFix);

const user = new JSONdb(pathPreFix + "/database/user.json");

const port = 6080;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port, () => console.log("Connecet with Port: " + port));

let sessionIds = [];

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
    await userHandling.createUser(bcrypt, user, JSON.parse(request.body.data))
  );
});

app.post("/user/validateLogin", async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "application/json");
  const newSID = Math.floor(Math.random() * 999999999999);

  const result = await userHandling.validateLogin(
    bcrypt,
    user,
    JSON.parse(request.body.data),
    newSID
  );
  console.log("reulst", result);
  if (result.msg === "Passwort is correct" && result.succes) {
    sessionIds.push(newSID);
    response.json(result);
  }
  response.json();
});

app.post("/session/validate", async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "application/json");

  const data = JSON.parse(request.body.data)
  console.log("sesion validate", data.SID);
  if (sessionIds.includes(parseInt(data.SID))) {
    console.log("Session exists");
    response.json({ status: "valid" });
  } else {
    response.json({ status: "unvalid" });
    console.log("Session not exists");
  }
});
