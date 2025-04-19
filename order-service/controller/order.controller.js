const orderService = require('../service/order.service');
const amqp = require('amqplib');

const sendOrderToCustomer = async (order) => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchange = 'order_exchange';
    const routingKey = 'order.created'; // Key để phân phối sự kiện

    await channel.assertExchange(exchange, 'direct', { durable: true });
    const message = JSON.stringify(order);
    channel.publish(exchange, routingKey, Buffer.from(message), { persistent: true });

    console.log('Sent order to Customer service:', order);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error sending order to Customer service:', error);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.create(req.body);
    await sendOrderToCustomer(order);  // Gửi sự kiện order tới Customer
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

// Các hàm khác giữ nguyên
exports.getOrder = async (req, res) => {
  try {
    const order = await orderService.getById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving order', error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders', error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await orderService.update(req.params.id, req.body);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await orderService.remove(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
};
