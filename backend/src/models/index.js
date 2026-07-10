const sequelize = require("../config/database");
const User = require("./user.model");
const Product = require("./product.model");
const Customer = require("./customer.model");
const Order = require("./order.model");
const OrderItem = require("./orderItem.model");

// Define Associations
Customer.hasMany(Order, { foreignKey: "customerId", as: "orders", onDelete: "CASCADE" });
Order.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = {
  sequelize,
  User,
  Product,
  Customer,
  Order,
  OrderItem,
};
