const validator = require("validator");

const validateFunction = (req) => {
  // Validate the request body for user signup
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || firstName.length < 5 || lastName.length < 5) {
    throw new Error("First name and last name are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  } else return;
};

module.exports = validateFunction
