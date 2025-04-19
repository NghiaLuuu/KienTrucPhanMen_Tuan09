const express = require('express');
const router = express.Router();
const controller = require('../controller/order.controller');

// CRUD for orders
router.post('/', controller.createOrder);
router.get('/', controller.getAllOrders);
router.get('/:id', controller.getOrder);
router.put('/:id', controller.updateOrder);
router.delete('/:id', controller.deleteOrder);

module.exports = router;
