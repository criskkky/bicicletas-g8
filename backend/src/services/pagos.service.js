// service.js
const { Technician, WorkLog, PaymentReport } = require('./entity');

class TechnicianService {
  constructor() {
    this.technicians = []; // Lista de técnicos
  }

  addTechnician(technician) {
    this.technicians.push(technician);
  }

  recordWork(technicianId, workLog) {
    const technician = this.technicians.find(t => t.id === technicianId);
    if (technician) technician.workLogs.push(workLog);
    else throw new Error('Técnico no encontrado');
  }

  calculatePayment(technicianId, period) {
    const technician = this.technicians.find(t => t.id === technicianId);
    if (!technician) throw new Error('Técnico no encontrado');

    const workLogsInPeriod = technician.workLogs.filter(log => log.date.includes(period));
    let totalPayment = 0;

    workLogsInPeriod.forEach(log => {
      let rate = technician.ratePerHour;

      // Personalización de tarifas según el tipo de trabajo
      if (log.type === 'venta') rate *= 1.5;
      if (log.type === 'mantenimiento') rate *= 1.2;

      totalPayment += rate * log.hours;

      // Impacto de inventarios utilizados
      log.productsUsed.forEach(product => {
        totalPayment += product.cost * 0.1; // Ejemplo: 10% del costo de productos usados
      });
    });

    return new PaymentReport(technicianId, period, totalPayment);
  }

  generatePaymentReports(period) {
    return this.technicians.map(tech => this.calculatePayment(tech.id, period));
  }
}

module.exports = new TechnicianService();
