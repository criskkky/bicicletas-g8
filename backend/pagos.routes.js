// routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Rutas para los técnicos y registros de trabajo
router.post('/technicians', controller.addTechnician);
router.post('/worklogs', controller.recordWork);
router.get('/reports', controller.generatePaymentReports);

module.exports = router;
