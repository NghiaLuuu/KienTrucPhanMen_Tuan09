const Customer = require('../model/Customer');

// Lấy tất cả khách hàng
exports.getAll = async () => {
  return Customer.find();
};

// Lấy khách hàng theo ID
exports.getById = async (id) => {
  return Customer.findById(id);
};

// Tạo mới khách hàng
exports.create = async (data) => {
  const customer = new Customer(data);
  return customer.save();
};

// Cập nhật thông tin khách hàng
exports.update = async (id, data) => {
  return Customer.findByIdAndUpdate(id, data, { new: true });
};

// Xóa khách hàng
exports.remove = async (id) => {
  return Customer.findByIdAndDelete(id);
};
