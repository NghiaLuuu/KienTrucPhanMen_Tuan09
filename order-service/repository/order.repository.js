const Order = require('../model/Order');

// Lấy tất cả đơn hàng
exports.getAll = async () => {
  return Order.find().populate('customerId productIds');
};

// Lấy đơn hàng theo ID
exports.getById = async (id) => {
  return Order.findById(id).populate('customerId productIds');
};

// Tạo đơn hàng mới
exports.create = async (data) => {
  const order = new Order(data);
  return order.save();
};

// Cập nhật đơn hàng
exports.update = async (id, data) => {
  return Order.findByIdAndUpdate(id, data, { new: true });
};

// Xóa đơn hàng
exports.remove = async (id) => {
  return Order.findByIdAndDelete(id);
};
