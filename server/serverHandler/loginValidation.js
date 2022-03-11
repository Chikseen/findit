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
    } else if (data.password.length < 8) {
      console.log("password to short");
      return {
        isError: true,
        errormsg: "passwordToShort",
        msg: "Your password needs to be at least 8 characters long",
      };
    } else if (data.password != data.repeatPassword) {
      console.log("password is not the same");
      return {
        isError: true,
        errormsg: "passwordNotSame",
        msg: "You have diffrent passwords",
      };
    } else {
      try {
        console.log("Validation correct");

        if (!user.has(data.userName)) {
          console.log("create user: ", data.userName);

          const salt = await bcrypt.genSalt();
          data.password = await bcrypt.hash(data.password, salt);
          delete data.repeatPassword;

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

      if (await bcrypt.compare(data.password, userdata.password)) {
        return {
          isError: false,
          errormsg: "",
          msg: "Password is correct -> proceed",
        };
      } else {
        return {
          isError: true,
          errormsg: "wrongUserdata",
          msg: "Wrong username or password",
        };
      }
    } else {
      return {
        isError: true,
        errormsg: "wrongUserdata",
        msg: "Wrong username or password",
      };
    }
  },
};
