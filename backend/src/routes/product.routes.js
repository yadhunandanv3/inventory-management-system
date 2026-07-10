const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const protect = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/auth.middleware");
const {
  createProductValidator,
  listProductsValidator,
  updateProductValidator,
} = require("../validators/product.validator");
const validate = require("../middleware/validate");

const router = express.Router();

// Protect all routes
router.use(protect);

router.get("/", listProductsValidator, validate, getProducts);
router.get("/:id", getProductById);
router.post("/", authorize("ADMIN", "MANAGER"), createProductValidator, validate, createProduct);
router.put("/:id", authorize("ADMIN", "MANAGER"), updateProductValidator, validate, updateProduct);
router.delete("/:id", authorize("ADMIN"), deleteProduct);

module.exports = router;
