const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Định tuyến yêu cầu đến Product Service
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const response = await axios.get(`http://product-service:3001/products/${productId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error in Product Service:', error);
    res.status(500).send('Error fetching product data');
  }
});

// Định tuyến yêu cầu đến Order Service
app.post('/orders', async (req, res) => {
  const orderData = req.body;
  try {
    const response = await axios.post('http://order-service:3002/orders', orderData);
    res.json(response.data);
  } catch (error) {
    console.error('Error in Order Service:', error);
    res.status(500).send('Error creating order');
  }
});

// Định tuyến yêu cầu đến Customer Service
app.get('/customers/:id', async (req, res) => {
  const customerId = req.params.id;
  try {
    const response = await axios.get(`http://customer-service:3003/customers/${customerId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error in Customer Service:', error);
    res.status(500).send('Error fetching customer data');
  }
});

// Chạy API Gateway
app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});
