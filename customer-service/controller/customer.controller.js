const customerService = require('../service/customer.service');
const amqp = require('amqplib');

// Hàm lắng nghe sự kiện từ RabbitMQ
const listenForOrders = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchange = 'order_exchange';
    const routingKey = 'order.created'; // Key sự kiện cần lắng nghe

    await channel.assertExchange(exchange, 'direct', { durable: true });
    const queue = 'customer_queue';
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    console.log('Waiting for order events...');
    channel.consume(queue, async (msg) => {
      const order = JSON.parse(msg.content.toString());
      console.log('Received order:', order);
      
      // Chỉ hiển thị thông tin đơn hàng mà không tạo khách hàng
      console.log('Order received:', order);
      channel.ack(msg);  // Xác nhận đã xử lý xong thông điệp
    });
  } catch (error) {
    console.error('Error listening for orders:', error);
  }
};


listenForOrders();  // Gọi hàm để bắt đầu lắng nghe sự kiện từ RabbitMQ

exports.createCustomer = async (req, res) => {
  try {
    const customer = await customerService.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error creating customer', error: err });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await customerService.getById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving customer', error: err });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAll();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving customers', error: err });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await customerService.update(req.params.id, req.body);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error updating customer', error: err });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await customerService.remove(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting customer', error: err });
  }
};
