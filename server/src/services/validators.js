function birthdayValidator(birthday) {
  birthday = new Date(birthday);
  if (birthday.toString() === "Invalid Date" || isNaN(birthday.valueOf())) {
    return res.status(400).json({
      error: "invalid birthday date",
    });
  } else return birthday;
}

function notNullUserValidator(newUser) {
  if (!newUser.username || !newUser.nickname || !newUser.email) {
    return res.status(400).json({
      error: "user data cannot be null",
    });
  }
}

function userHasBirthdayAndValidateIt(newUser) {
  if (newUser.birthday) {
    newUser.birthday = birthdayValidator(newUser.birthday);
    return newUser;
  }
}

module.exports = {
  birthdayValidator,
  notNullUserValidator,
  userHasBirthdayAndValidateIt,
};
