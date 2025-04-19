const productService = require('../service/product.service');

exports.createProduct = async (req, res) => {
  const product = await productService.create(req.body);
  res.json(product);
};

exports.getProduct = async (req, res) => {
  const product = await productService.getById(req.params.id);
  res.json(product);
};

exports.getAllProducts = async (req, res) => {
  const products = await productService.getAll();
  res.json(products);
};

exports.updateProduct = async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await productService.remove(req.params.id);
  res.json({ message: 'Deleted' });
};
