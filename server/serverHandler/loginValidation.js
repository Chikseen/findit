module.exports = {
  async createUser(bcrypt, user, data) {
    console.log("Create user");
    if (data.userName.length < 8) {
      console.log("userName to short");
      return {
        isError: true,
        errormsg: "usernameToShort",
        msg: "Your username needs to be at least 8 characters long",
      };
    } else if (data.passwort.length < 8) {
      console.log("passwort to short");
      return {
        isError: true,
        errormsg: "passwortToShort",
        msg: "Your passwort needs to be at least 8 characters long",
      };
    } else if (data.passwort != data.repeatPasswort) {
      console.log("passwort is not the same");
      return {
        isError: true,
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
            errormsg: "",
            msg: "User created successfully",
          };
        } else {
          console.log("User allrady exits");
          return {
            isError: true,
            errormsg: "userExits",
            msg: "The username allrady exits",
          };
        }
      } catch (e) {
        return {
          isError: true,
          errormsg: "unexpected",
          msg: "Something unexepted happend",
        };
      }
    }
  },
  async validateLogin(bcrypt, user, data) {
    console.log("Check Data");

    //validate userdate
    if (user.has(data.userName)) {
      const userdata = user.get(data.userName);

      if (await bcrypt.compare(data.passwort, userdata.passwort)) {
        return {
          isError: false,
          errormsg: "",
          msg: "Passwort is correct -> proceed",
        };
      } else {
        return {
          isError: true,
          errormsg: "wrongUserdata",
          msg: "Wrong username or passwort",
        };
      }
    } else {
      return {
        isError: true,
        errormsg: "wrongUserdata",
        msg: "Wrong username or passwort",
      };
    }
  },
};
