"use strict";
const express = require("express");
const app = express();
const fs = require("fs");
const bcrypt = require("bcrypt");
const JSONdb = require("simple-json-db");
const cors = require("cors");

const databaseIntegrity = require("./dbhandler/dbinit.js");
const userHandling = require("./dbhandler/userHandling.js");

let pathPreFix = "";
if (fs.existsSync("../localDebug.js")) pathPreFix = ".";

databaseIntegrity.init(fs, pathPreFix);

const user = new JSONdb(pathPreFix + "/database/user.json");

const port = 6080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log("Connecet with Port: " + port));

let sessionIds = [];
let userSessionRealtion = {};

// Test to check if online
app.post("/", (req, res) => {
  res.json({ status: "success" });
});

// Create User
app.post("/user/createAccount", async (request, response) => {
  response.json(await userHandling.createUser(bcrypt, user, request.body));
});

app.post("/user/validateLogin", async (request, response) => {
  const newSID = Math.floor(Math.random() * 999999999999);
  const result = await userHandling.validateLogin(
    bcrypt,
    user,
    request.body,
    newSID
  );
  console.log("Validation Result", result);
  if (result.msg === "Passwort is correct" && result.succes) {
    if (request.body.userName.length > 2) {
      sessionIds.push(newSID);
      userSessionRealtion[request.body.userName] = newSID;
      response.json(result);
    } else
      response.json({
        isError: true,
        succes: false,
        errormsg: "unexpected",
        msg: "Something unexepted happend",
      });
  } else
    response.json({
      isError: true,
      succes: false,
      errormsg: "unexpected",
      msg: "Something unexepted happend",
    });
});

app.post("/session/validate", async (request, response) => {
  const data = request.body;
  if (sessionIds.includes(parseInt(data.SID))) {
    if (userSessionRealtion[data.user] == data.SID) {
      console.log("Session exists");
      response.json({ status: true });
    } else {
      response.json({ status: false });
      console.log("Session not exists");
    }
  } else {
    response.json({ status: false });
    console.log("Session not exists");
  }
});

app.post("/session/destroy", async (request, response) => {
  console.log("destroy session", request.body.SID);
  const index = sessionIds.indexOf(parseInt(request.body.SID));
  if (index > -1) {
    sessionIds.splice(index, 1);
    delete userSessionRealtion[request.body.user];
  }
  console.log("sesionIDs", sessionIds);
  response.json({ status: "success" });
});

app.post("/session/checkUser", async (request, response) => {
  console.log("checkUser", request.body);
  const data = request.body;
  console.log("userSessionRealtion", userSessionRealtion);
  if (typeof request.body.user == "string" && typeof request.body.SID == "string") {
    if (userSessionRealtion[data.user] == data.SID) {
      console.log("Session exists");
      response.json({ status: true });
    } else {
      console.log("Session not exists");
      response.json({ status: false });
    }
  } else {
    console.log("Session not exists");
    response.json({ status: false });
  }
});
