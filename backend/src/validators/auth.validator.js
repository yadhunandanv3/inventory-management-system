const { body } = require("express-validator");
const { User } = require("../models");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .bail()
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("Email already registered");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .bail()
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = {
  registerValidator,
  loginValidator,
};
