
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/orders', orderController.createOrder);     
router.get('/orders', orderController.getAllOrders);      
router.get('/orders/:id', orderController.getOrder);      
router.patch('/orders/:id', orderController.updateOrder);  
router.delete('/orders/:id', orderController.deleteOrder); 

module.exports = router;
