const { sequelize, Order, OrderItem, Product, Customer } = require("../models");

class OrderService {
  /**
   * Create an Order with items inside a transaction.
   * Checks stock, updates stock, calculates totals, and creates records.
   */
  async createOrder({ customerId, items }) {
    // Start Sequelize transaction
    const transaction = await sequelize.transaction();

    try {
      let totalAmount = 0;
      const orderItemsData = [];
      const productsToUpdate = [];

      const aggregatedItems = Object.values(
        items.reduce((acc, item) => {
          if (!acc[item.productId]) {
            acc[item.productId] = {
              productId: item.productId,
              quantity: 0,
            };
          }

          acc[item.productId].quantity += item.quantity;
          return acc;
        }, {})
      );
      const sortedItems = aggregatedItems.sort((a, b) => a.productId - b.productId);

      // Validate products and check inventory
      for (const item of sortedItems) {
        const product = await Product.findByPk(item.productId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for product "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`
          );
        }

        // Calculate line total
        const price = parseFloat(product.price);
        totalAmount += price * item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: price,
        });

        // Store info to update product quantity later
        productsToUpdate.push({
          product,
          newQuantity: product.quantity - item.quantity,
        });
      }

      // 1. Create the Order
      const order = await Order.create(
        {
          customerId,
          totalAmount: totalAmount.toFixed(2),
          status: "PENDING",
          orderDate: new Date(),
        },
        { transaction }
      );

      // 2. Create the Order Items
      const itemsToCreate = orderItemsData.map((item) => ({
        ...item,
        orderId: order.id,
      }));

      await OrderItem.bulkCreate(itemsToCreate, { transaction });

      // 3. Update the Product Inventory quantities
      for (const itemToUpdate of productsToUpdate) {
        await itemToUpdate.product.update(
          { quantity: itemToUpdate.newQuantity },
          { transaction }
        );
      }

      // Commit transaction
      await transaction.commit();

      // Fetch the full order details to return
      const fullOrder = await Order.findByPk(order.id, {
        include: [
          { model: Customer, as: "customer" },
          {
            model: OrderItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
      });

      return fullOrder;
    } catch (error) {
      // Rollback transaction if any step fails
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update order status. If changing status to CANCELLED, restore product stock.
   */
  async updateOrderStatus(orderId, status) {
    const transaction = await sequelize.transaction();

    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, as: "items" }],
        transaction,
      });

      if (!order) {
        throw new Error("Order not found");
      }

      const oldStatus = order.status;

      if (oldStatus === status) {
        await transaction.commit();
        return order;
      }

      // If transition to CANCELLED from a non-cancelled state, restore inventory
      if (status === "CANCELLED" && oldStatus !== "CANCELLED") {
        for (const item of order.items) {
          const product = await Product.findByPk(item.productId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
          });
          if (product) {
            await product.update(
              { quantity: product.quantity + item.quantity },
              { transaction }
            );
          }
        }
      }

      // If transition FROM CANCELLED back to active status, re-verify and deduct inventory
      if (oldStatus === "CANCELLED" && status !== "CANCELLED") {
        for (const item of order.items) {
          const product = await Product.findByPk(item.productId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
          });
          if (!product) {
            throw new Error(`Product ID ${item.productId} no longer exists`);
          }
          if (product.quantity < item.quantity) {
            throw new Error(
              `Insufficient stock to reopen order. Product "${product.name}" has ${product.quantity} units, needs ${item.quantity}`
            );
          }
          await product.update(
            { quantity: product.quantity - item.quantity },
            { transaction }
          );
        }
      }

      order.status = status;
      await order.save({ transaction });

      await transaction.commit();

      const updatedOrder = await Order.findByPk(orderId, {
        include: [
          { model: Customer, as: "customer" },
          {
            model: OrderItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
      });

      return updatedOrder;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete an order. If it's not CANCELLED, restore product stock before deleting.
   */
  async deleteOrder(orderId) {
    const transaction = await sequelize.transaction();

    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, as: "items" }],
        transaction,
      });

      if (!order) {
        throw new Error("Order not found");
      }

      // Restore stock if the order wasn't already cancelled
      if (order.status !== "CANCELLED") {
        for (const item of order.items) {
          const product = await Product.findByPk(item.productId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
          });
          if (product) {
            await product.update(
              { quantity: product.quantity + item.quantity },
              { transaction }
            );
          }
        }
      }

      // Delete Order (associated items will cascade delete automatically)
      await order.destroy({ transaction });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new OrderService();
