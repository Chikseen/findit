module.exports = {
  async createUser(bcrypt, user, data) {
    console.log("Create user", data);
    if (data.userName.length < 2) {
      console.log("userName to short");
      return {
        isError: true,
        succes: false,
        errormsg: "usernameToShort",
        msg: "Your username needs to be at least 8 characters long",
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

        if (!user.has(data.userName)) {
          console.log("create user: ", data.userName);

          const salt = await bcrypt.genSalt();
          data.passwort = await bcrypt.hash(data.passwort, salt);
          delete data.repeatPasswort;

          user.set(data.userName, data);
          return {
            isError: false,
            succes: true,
            errormsg: "",
            msg: "User created successfully",
          };
        } else {
          console.log("User allrady exits");
          return {
            isError: true,
            succes: false,
            loginSucces: false,
            errormsg: "userExits",
            msg: "The username allrady exits",
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
  async validateLogin(bcrypt, user, data, newSID) {
    console.log("Check logindata for", data.userName);
    console.log("SID", newSID);

    //validate userdate
    if (user.has(data.userName)) {
      const userdata = user.get(data.userName);

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
