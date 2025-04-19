const Product = require('../model/Product');

// Lấy tất cả sản phẩm
exports.getAll = async () => {
  return Product.find();
};

// Lấy sản phẩm theo ID
exports.getById = async (id) => {
  return Product.findById(id);
};

// Tạo mới sản phẩm
exports.create = async (data) => {
  const product = new Product(data);
  return product.save();
};

// Cập nhật sản phẩm
exports.update = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

// Xóa sản phẩm
exports.remove = async (id) => {
  return Product.findByIdAndDelete(id);
};
