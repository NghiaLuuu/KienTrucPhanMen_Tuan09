const express = require('express');
const router = express.Router();
const controller = require('../controller/customer.controller');

// CRUD for customers
router.post('/', controller.createCustomer);
router.get('/', controller.getAllCustomers);
router.get('/:id', controller.getCustomer);
router.put('/:id', controller.updateCustomer);
router.delete('/:id', controller.deleteCustomer);

module.exports = router;
