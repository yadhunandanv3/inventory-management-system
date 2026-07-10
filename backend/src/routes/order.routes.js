const express = require("express");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.controller");
const protect = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/auth.middleware");
const {
  createOrderValidator,
  listOrdersValidator,
  updateOrderStatusValidator,
} = require("../validators/order.validator");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router.get("/", listOrdersValidator, validate, getOrders);
router.get("/:id", getOrderById);
router.post("/", authorize("ADMIN", "MANAGER", "STAFF"), createOrderValidator, validate, createOrder);
router.put("/:id/status", authorize("ADMIN", "MANAGER"), updateOrderStatusValidator, validate, updateOrderStatus);
router.delete("/:id", authorize("ADMIN"), deleteOrder);

module.exports = router;
