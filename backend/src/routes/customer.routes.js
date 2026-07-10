const express = require("express");
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer.controller");
const protect = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/auth.middleware");
const {
  createCustomerValidator,
  listCustomersValidator,
  updateCustomerValidator,
} = require("../validators/customer.validator");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router.get("/", listCustomersValidator, validate, getCustomers);
router.get("/:id", getCustomerById);
router.post("/", authorize("ADMIN", "MANAGER"), createCustomerValidator, validate, createCustomer);
router.put("/:id", authorize("ADMIN", "MANAGER"), updateCustomerValidator, validate, updateCustomer);
router.delete("/:id", authorize("ADMIN"), deleteCustomer);

module.exports = router;
