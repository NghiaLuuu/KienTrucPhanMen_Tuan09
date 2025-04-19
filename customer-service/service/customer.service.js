const customerRepository = require('../repository/customer.repository');

// Tạo khách hàng mới
exports.create = (data) => customerRepository.create(data);

// Lấy khách hàng theo ID
exports.getById = (id) => customerRepository.getById(id);

// Lấy tất cả khách hàng
exports.getAll = () => customerRepository.getAll();

// Cập nhật thông tin khách hàng
exports.update = (id, data) => customerRepository.update(id, data);

// Xóa khách hàng
exports.remove = (id) => customerRepository.remove(id);
