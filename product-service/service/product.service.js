const productRepository = require('../repository/product.repository');

// Tạo sản phẩm
exports.create = (data) => productRepository.create(data);

// Lấy sản phẩm theo ID
exports.getById = (id) => productRepository.getById(id);

// Lấy tất cả sản phẩm
exports.getAll = () => productRepository.getAll();

// Cập nhật sản phẩm
exports.update = (id, data) => productRepository.update(id, data);

// Xóa sản phẩm
exports.remove = (id) => productRepository.remove(id);
