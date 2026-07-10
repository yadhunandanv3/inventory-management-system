const orderService = require("../services/order.service");
const { Order, Customer, OrderItem, Product } = require("../models");

const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows } = await Order.findAndCountAll({
      limit: limitNumber,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "sku", "price"],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      orders: rows,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { customerId, items } = req.body;

    const order = await orderService.createOrder({ customerId, items });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    // If it's a validation error or inventory error, return 400
    res.status(400);
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await orderService.updateOrderStatus(orderId, status);

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    await orderService.deleteOrder(orderId);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully and stock restored if active",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
