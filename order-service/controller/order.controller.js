const orderService = require('../service/order.service');
const amqp = require('amqplib');
const CircuitBreaker = require('opossum');
const Bottleneck = require('bottleneck');
const retry = require('async-retry');
// Rate Limiter: 5 requests per minute
const limiter = new Bottleneck({
  reservoir: 5,
  reservoirRefreshAmount: 5,
  reservoirRefreshInterval: 60 * 1000, // Lấy lại 5 yêu cầu mỗi phút
  maxConcurrent: 1, // Chỉ cho phép 1 yêu cầu tại một thời điểm
  minTime: 200 // Thời gian chờ tối thiểu giữa các yêu cầu (ms)
});

// Raw send function
await retry(async (bail, attempt) => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchange = 'order_exchange';
    const routingKey = 'order.created';

    await channel.assertExchange(exchange, 'direct', { durable: true });
    const message = JSON.stringify(order);
    channel.publish(exchange, routingKey, Buffer.from(message), { persistent: true });

    console.log(`Sent order to Customer service (attempt ${attempt}):`, order);
    await channel.close();
    await connection.close();
  } catch (error) {
    if (error instanceof SomeNonRetryableError) {
      bail(error); // Nếu gặp lỗi không thể khắc phục, ngừng thử lại
      return;
    }
    throw error; // Nếu có lỗi khác, tiếp tục thử lại
  }
}, {
  retries: 5, // Số lần thử lại tối đa
  minTimeout: 1000, // Thời gian chờ giữa các lần thử (ms)
  factor: 2 // Hệ số tăng thời gian chờ (exponential backoff)
});


// Circuit Breaker options
const breakerOptions = {
  timeout: 5000, // Nếu một yêu cầu không trả lời trong 5 giây, sẽ coi như lỗi
  errorThresholdPercentage: 50, // Nếu 50% yêu cầu gặp lỗi, mở mạch (open circuit)
  resetTimeout: 30000 // Sau 30 giây, sẽ thử lại
};

const breaker = new CircuitBreaker(rawSendOrderToCustomer, breakerOptions);

// Final wrapped function with limiter + circuit breaker
const sendOrderWithProtection = async (order) => {
  try {
    await limiter.schedule(() => breaker.fire(order));
  } catch (error) {
    console.error('Error sending order to Customer service:', error);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.create(req.body);
    await sendOrderWithProtection(order); // Use protected send
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

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
