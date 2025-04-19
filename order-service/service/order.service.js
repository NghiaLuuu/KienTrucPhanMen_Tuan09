const orderRepository = require('../repository/order.repository');
const { getProductDetails } = require('./productService');

exports.create = async (data) => {
  const { productId, quantity } = data;

  // Gọi API từ product-service để lấy thông tin sản phẩm
  const product = await getProductDetails(productId);

  // Tạo đơn hàng mới với thông tin sản phẩm
  const orderData = {
    productId,
    quantity,
    productName: product.name,
    productPrice: product.price,
    totalPrice: product.price * quantity,
  };

  return await orderRepository.create(orderData);
};
// Tạo đơn hàng mới
exports.create = (data) => orderRepository.create(data);

// Lấy đơn hàng theo ID
exports.getById = (id) => orderRepository.getById(id);

// Lấy tất cả đơn hàng
exports.getAll = () => orderRepository.getAll();

// Cập nhật đơn hàng
exports.update = (id, data) => orderRepository.update(id, data);

// Xóa đơn hàng
exports.remove = (id) => orderRepository.remove(id);
