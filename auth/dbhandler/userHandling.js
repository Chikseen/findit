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
    } else if (data.password.length < 8) {
      console.log("password to short");
      return {
        isError: true,
        succes: false,
        errormsg: "passwordToShort",
        msg: "Your password needs to be at least 8 characters long",
      };
    } else if (data.password != data.repeatPassword) {
      console.log("password is not the same");
      return {
        isError: true,
        succes: false,
        errormsg: "passwordNotSame",
        msg: "You have diffrent passwords",
      };
    } else {
      try {
        console.log("Validation correct");
        if (!user.has(data.email)) {
          if (!eur.has(data.userName)) {
            console.log("create user: ", data.email);

            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(data.password, salt);
            delete data.repeatPassword;
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

    try {
      //validate userdate
      if (user.has(eur.get(data.userName))) {
        const userdata = user.get(eur.get(data.userName));

        console.log("DDAATTAA", data);
        console.log("DDAATTAA", data.password);
        console.log("DDAATTAA", userdata.password);

        if (await bcrypt.compare(data.password, userdata.password)) {
          return {
            isError: false,
            succes: true,
            errormsg: null,
            SID: newSID,
            msg: "Password is correct",
          };
        } else {
          return {
            isError: true,
            succes: false,
            errormsg: "wrongUserdata",
            SID: null,
            msg: "Wrong username or password",
          };
        }
      } else {
        return {
          isError: true,
          succes: false,
          errormsg: "wrongUserdata",
          SID: null,
          msg: "Wrong username or password",
        };
      }
    } catch (error) {
      return {
        isError: true,
        succes: false,
        errormsg: "",
        SID: null,
        msg: "Something unexpected happend",
      };
    }
  },
};
