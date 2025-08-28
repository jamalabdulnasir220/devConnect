const validator = require("validator");

const validateFunction = (req) => {
  const errors = [];

  const { firstName, lastName, email, password } = req.body;

  // Validate firstName
  if (!firstName || typeof firstName !== "string" || firstName.trim().length < 5) {
    errors.push("First name is required and must be at least 5 characters long.");
  }

  // Validate lastName
  if (!lastName || typeof lastName !== "string" || lastName.trim().length < 5) {
    errors.push("Last name is required and must be at least 5 characters long.");
  }

  // Validate email
  if (!email || typeof email !== "string" || !validator.isEmail(email)) {
    errors.push("A valid email is required.");
  }

  // Validate password
  if (!password || typeof password !== "string") {
    errors.push("Password is required.");
  } else if (!validator.isStrongPassword(password)) {
    errors.push(
      "Password is not strong enough. It must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol."
    );
  }

  if (errors.length > 0) {
    // Combine all errors into a single error message
    throw new Error(errors.join(" "));
  }
};

const validateEditProfile = (req) => {
  const updatesAllowed = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "photo",
    "about",
    "skills",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((field) =>
    updatesAllowed.includes(field)
  );

  return isUpdateAllowed;
};

module.exports = {
  validateFunction,
  validateEditProfile
};
