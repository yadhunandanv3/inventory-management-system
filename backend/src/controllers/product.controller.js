const { Product } = require("../models");
const { Op } = require("sequelize");

const getProducts = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const offset = (pageNumber - 1) * limitNumber;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      products: rows,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, price, quantity } = req.body;

    const product = await Product.create({
      name,
      sku,
      description,
      price,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, sku, description, price, quantity } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.update({
      name: name !== undefined ? name : product.name,
      sku: sku !== undefined ? sku : product.sku,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? price : product.price,
      quantity: quantity !== undefined ? quantity : product.quantity,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
