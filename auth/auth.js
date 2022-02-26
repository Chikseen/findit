"use strict";
const express = require("express");
const app = express();
const fs = require("fs");
const bcrypt = require("bcrypt");
const JSONdb = require("simple-json-db");
const cors = require("cors");

const databaseIntegrity = require("./dbhandler/dbinit.js");
const userHandling = require("./dbhandler/userHandling.js");
const helper = require("./dbhandler/helper.js");
let pathPreFix = "";
if (fs.existsSync("../localDebug.js")) pathPreFix = ".";

databaseIntegrity.init(fs, pathPreFix);

const user = new JSONdb(pathPreFix + "/database/user.json");
const mailAuth = new JSONdb(pathPreFix + "/database/mailAuth.json");
const eur = new JSONdb(pathPreFix + "/database/emailuserrealation.json");

const port = 6080;

//________________________________________________________

var nodemailer = require("nodemailer");
const { sendMail } = require("./mailHandling/mailer.js");
const initMailTemplate = require("./mailHandling/initMailTemplate.js");

var transporter = nodemailer.createTransport({
  service: mailAuth.get("mailData").service,
  auth: {
    user: mailAuth.get("mailData").name,
    pass: mailAuth.get("mailData").apKey,
  },
});

// Send init mail on server start
console.log("Send init mail");
const initmail = {
  subject: "Init Mail",
  html: initMailTemplate.initmail(),
};
 
sendMail(
  transporter,
  mailAuth.storage.mailData.name,
  mailAuth.storage.mailData.name,
  initmail
); 
//________________________________________________________

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log("Connecet with Port: " + port));

let sessionIds = [];
let userSessionRealtion = {};
let toValidate = {};

app.get("/", async (request, response) => {
  response.json({ status: "success" });
});

// Create User
app.post("/user/createAccount", async (request, response) => {
  console.log("temp", request.body);
  const id = helper.generateRandomString();
  const status = await userHandling.createUser(
    bcrypt,
    user,
    eur,
    request.body,
    id
  );
  if (status.succes) {
    //Send varification email
    toValidate[id] = request.body.email;

    console.log("to verify", toValidate);

    const varimail = {
      subject: "Validate your E-Mail address",
      html: initMailTemplate.valimail(id),
    };
    sendMail(
      transporter,
      mailAuth.get("mailData").name,
      request.body.email,
      varimail
    );
  }
  response.json(status);
});
app.post("/user/reSendValidation", async (request, response) => {
  const id = helper.generateRandomString();
  toValidate[id] = eur.get(request.body.user);

  console.log("resend", toValidate);

  const usertemp = user.get(eur.get(request.body.user));
  usertemp.varifiyID = id;
  user.set(eur.get(request.body.user), usertemp);

  const varimail = {
    subject: "Validate your E-Mail address",
    html: initMailTemplate.valimail(id),
  };
  sendMail(
    transporter,
    mailAuth.get("mailData").name,
    eur.get(request.body.user),
    varimail
  );
  response.json({ done: "done" });
});

app.post("/user/validateEmail", async (request, response) => {
  const mailToCheck = toValidate[request.body.vid];
  console.log("--vid]", request.body.vid);
  console.log("toValidate[request.body.vid]", toValidate[request.body.vid]);
  console.log("mailtocheck___", mailToCheck);
  if (mailToCheck != undefined) {
    console.log("mailToCheck", mailToCheck);
    const userTempDB = user.get(mailToCheck);
    const vid = userTempDB.varifiyID;
    console.log("vid", vid);
    if (vid != "") {
      if (vid == request.body.vid) {
        delete toValidate[vid];
        userTempDB.isValidated = true;
        userTempDB.varifiyID = "";
        console.log("set with this", userTempDB);
        user.set(mailToCheck, userTempDB);
        response.json({ status: true });
      } else {
        response.json({ status: false });
      }
    } else {
      response.json({ status: false });
    }
  } else {
    response.json({ status: false });
  }
  console.log("nowmailsrealtloptgrejkd+", toValidate);
});

app.post("/user/validateLogin", async (request, response) => {
  const newSID = helper.generateRandomString();
  const result = await userHandling.validateLogin(
    bcrypt,
    user,
    eur,
    request.body,
    newSID
  );
  console.log("Validation Result", result);
  if (result.msg === "Passwort is correct" && result.succes) {
    if (request.body.userName.length > 2) {
      console.log(
        "is user validated",
        user.get(eur.get(request.body.userName)).isValidated
      );
      if (user.get(eur.get(request.body.userName)).isValidated) {
        sessionIds.push(newSID);
        userSessionRealtion[request.body.userName] = newSID;
        response.json(result);
      } else {
        console.log("not Validated");
        response.json({
          status: false,
          msg: "not Validated",
          err: "userNotValidated",
        });
      }
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
  if (sessionIds.includes(data.SID)) {
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
  if (
    typeof request.body.user == "string" &&
    typeof request.body.SID == "string"
  ) {
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
