module.exports = {
  async createUser(bcrypt, user, eur, data, id) {
    console.log("Create user", data);
    if (data.userName.length < 2) {
      console.log("userName to short");
      return {
        isError: true,
        succes: false,
        errormsg: "usernameToShort",
        msg: "Your username needs to be at least 8 characters long",
      };
    } else if (data.email.length < 4) {
      console.log("E-Mail validation failed");
      return {
        isError: true,
        succes: false,
        errormsg: "wrongemailformat",
        msg: "your E-Mail address dident pass verification",
      };
    } else if (data.passwort.length < 8) {
      console.log("passwort to short");
      return {
        isError: true,
        succes: false,
        errormsg: "passwortToShort",
        msg: "Your passwort needs to be at least 8 characters long",
      };
    } else if (data.passwort != data.repeatPasswort) {
      console.log("passwort is not the same");
      return {
        isError: true,
        succes: false,
        errormsg: "passwortNotSame",
        msg: "You have diffrent passworts",
      };
    } else {
      try {
        console.log("Validation correct");
        if (!user.has(data.email)) {
          if (!eur.has(data.userName)) {
            console.log("create user: ", data.email);

            const salt = await bcrypt.genSalt();
            data.passwort = await bcrypt.hash(data.passwort, salt);
            delete data.repeatPasswort;
            data.isValidated = false;
            data.varifiyID = id;

            user.set(data.email, data);
            eur.set(data.userName, data.email);
            return {
              isError: false,
              succes: true,
              errormsg: "",
              msg: "User created successfully",
            };
          } else {
            console.log("useName is allrady in use");
            return {
              isError: true,
              succes: false,
              loginSucces: false,
              errormsg: "usernameexits",
              msg: "Usename is allrady in use",
            };
          }
        } else {
          console.log("E-Mail address is allrady used");
          return {
            isError: true,
            succes: false,
            loginSucces: false,
            errormsg: "emailExits",
            msg: "E-Mail address is allrady used",
          };
        }
      } catch (e) {
        return {
          isError: true,
          succes: false,
          errormsg: "unexpected",
          msg: "Something unexepted happend",
        };
      }
    }
  },
  async validateLogin(bcrypt, user, eur, data, newSID) {
    console.log("Check logindata for", data.userName);
    console.log("SID", newSID);

    //validate userdate
    if (user.has(eur.get(data.userName))) {
      const userdata = user.get(eur.get(data.userName));

      if (await bcrypt.compare(data.passwort, userdata.passwort)) {
        return {
          isError: false,
          succes: true,
          errormsg: null,
          SID: newSID,
          msg: "Passwort is correct",
        };
      } else {
        return {
          isError: true,
          succes: false,
          errormsg: "wrongUserdata",
          SID: null,
          msg: "Wrong username or passwort",
        };
      }
    } else {
      return {
        isError: true,
        succes: false,
        errormsg: "wrongUserdata",
        SID: null,
        msg: "Wrong username or passwort",
      };
    }
  },
};
