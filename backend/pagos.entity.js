// entity.js
class Technician {
    constructor(id, name, ratePerHour, workLogs = []) {
      this.id = id;
      this.name = name;
      this.ratePerHour = ratePerHour; // Tarifa base por hora
      this.workLogs = workLogs; // Registro de horas trabajadas
    }
  }
  
  class WorkLog {
    constructor(date, hours, type, productsUsed = []) {
      this.date = date;
      this.hours = hours; // Horas trabajadas
      this.type = type; // Tipos: 'venta', 'mantenimiento', 'reparación'
      this.productsUsed = productsUsed; // Productos del inventario usados
    }
  }
  
  class Product {
    constructor(id, name, cost) {
      this.id = id;
      this.name = name;
      this.cost = cost;
    }
  }
  
  class PaymentReport {
    constructor(technicianId, period, totalPayment) {
      this.technicianId = technicianId;
      this.period = period;
      this.totalPayment = totalPayment;
    }
  }
  
  module.exports = { Technician, WorkLog, Product, PaymentReport };
  