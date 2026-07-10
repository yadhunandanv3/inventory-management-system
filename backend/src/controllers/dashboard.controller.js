const { Product, Customer, Order } = require("../models");
const { Op } = require("sequelize");

const getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.count();
    const totalCustomers = await Customer.count();
    const totalOrders = await Order.count();

    // Fetch products with quantity less than 10
    const lowStockProducts = await Product.findAll({
      where: {
        quantity: {
          [Op.lt]: 10,
        },
      },
      order: [["quantity", "ASC"]],
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalCustomers,
        totalOrders,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
