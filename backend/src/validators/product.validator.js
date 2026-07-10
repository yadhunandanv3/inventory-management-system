const { body, param, query } = require("express-validator");
const { Product } = require("../models");
const { Op } = require("sequelize");

const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),
  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required")
    .custom(async (value) => {
      const product = await Product.findOne({ where: { sku: value } });
      if (product) {
        throw new Error("SKU must be unique");
      }
      return true;
    }),
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity cannot be negative"),
];

const updateProductValidator = [
  param("id")
    .isInt()
    .withMessage("Invalid product ID"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty"),
  body("sku")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("SKU cannot be empty")
    .custom(async (value, { req }) => {
      const product = await Product.findOne({
        where: {
          sku: value,
          id: { [Op.ne]: req.params.id },
        },
      });
      if (product) {
        throw new Error("SKU must be unique");
      }
      return true;
    }),
  body("price")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),
  body("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity cannot be negative"),
];

const listProductsValidator = [
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
  createProductValidator,
  listProductsValidator,
  updateProductValidator,
};
