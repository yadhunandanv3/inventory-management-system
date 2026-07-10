const { body, param, query } = require("express-validator");
const { Customer } = require("../models");
const { Op } = require("sequelize");

const createCustomerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail()
    .custom(async (value) => {
      const customer = await Customer.findOne({ where: { email: value } });
      if (customer) {
        throw new Error("Customer with this email already exists");
      }
      return true;
    }),
  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .matches(/^\+?[0-9\s\-()]{7,20}$/)
    .withMessage("Must be a valid phone number (7-20 digits)"),
  body("address")
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
];

const updateCustomerValidator = [
  param("id")
    .isInt()
    .withMessage("Invalid customer ID"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Customer name cannot be empty"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const customer = await Customer.findOne({
        where: {
          email: value,
          id: { [Op.ne]: req.params.id },
        },
      });
      if (customer) {
        throw new Error("Customer with this email already exists");
      }
      return true;
    }),
  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .matches(/^\+?[0-9\s\-()]{7,20}$/)
    .withMessage("Must be a valid phone number (7-20 digits)"),
  body("address")
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
];

const listCustomersValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

module.exports = {
  createCustomerValidator,
  listCustomersValidator,
  updateCustomerValidator,
};
