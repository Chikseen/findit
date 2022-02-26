module.exports = {
  generateRandomString() {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * 20));
    }
    return result;
  },
};
