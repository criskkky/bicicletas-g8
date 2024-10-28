// controller.js
const technicianService = require('./service');

const addTechnician = (req, res) => {
  const { id, name, ratePerHour } = req.body;
  try {
    technicianService.addTechnician(new Technician(id, name, ratePerHour));
    res.status(201).send('Técnico agregado exitosamente');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const recordWork = (req, res) => {
  const { technicianId, date, hours, type, productsUsed } = req.body;
  try {
    technicianService.recordWork(
      technicianId,
      new WorkLog(date, hours, type, productsUsed)
    );
    res.status(201).send('Registro de trabajo agregado exitosamente');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const generatePaymentReports = (req, res) => {
  const { period } = req.query;
  try {
    const reports = technicianService.generatePaymentReports(period);
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { addTechnician, recordWork, generatePaymentReports };
