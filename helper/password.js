const bcrypt = require("bcrypt");

module.exports = {
  hash: (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  compare: (password, hash) => {
    return bcrypt.compareSync(password, hash);
  },

  generatePassword: (length) => {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$&ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    // Generate Password
    for (let i = 0; i < length; i++) {
      let randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }

    return password;
  },
};
