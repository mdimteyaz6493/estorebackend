const Product = require('../models/Product');

// Get all products with pagination
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    res.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Fetch products error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products without pagination
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Fetch products error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (err) {
    console.error('Fetch product by ID error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, description, images, countInStock, brand, bestseller } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const product = await Product.create({
      name,
      price,
      category,
      description,
      images, // expects an array of image URLs
      countInStock,
      brand,
      bestseller: bestseller ?? false // fallback to false if not provided
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err.message);
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const {
      name,
      price,
      category,
      description,
      images,
      countInStock,
      brand,
      bestseller
    } = req.body;

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (images !== undefined) product.images = images;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (brand !== undefined) product.brand = brand;
    if (bestseller !== undefined) product.bestseller = bestseller;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error('Update product error:', err.message);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err.message);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};
