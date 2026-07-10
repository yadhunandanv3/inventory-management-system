const { body, query } = require("express-validator");
const { Customer } = require("../models");

const createOrderValidator = [
  body("customerId")
    .isInt()
    .withMessage("Invalid customer ID")
    .custom(async (value) => {
      const customer = await Customer.findByPk(value);
      if (!customer) {
        throw new Error("Customer does not exist");
      }
      return true;
    }),
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("items.*.productId")
    .isInt()
    .withMessage("Invalid product ID"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

const updateOrderStatusValidator = [
  body("status")
    .isIn(["PENDING", "COMPLETED", "CANCELLED"])
    .withMessage("Status must be one of PENDING, COMPLETED, CANCELLED"),
];

const listOrdersValidator = [
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
  createOrderValidator,
  listOrdersValidator,
  updateOrderStatusValidator,
};
