import { AppDataSource } from "../config/configDb.js";
import Invoice from "../entity/invoice.entity.js";
import Maintenance from "../entity/maintenance.entity.js";

export async function getInvoiceService(id) {
  try {
    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const invoice = await invoiceRepository.findOne({ where: { id }, relations: ["maintenance"] });
    if (!invoice) return [null, "Factura no encontrada"];
    return [invoice, null];
  } catch (error) {
    console.error("Error al obtener la factura:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllInvoicesService() {
  try {
    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const invoices = await invoiceRepository.find({ relations: ["maintenance"] });
    if (invoices.length === 0) return [null, "No se encontraron facturas"];
    return [invoices, null];
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createInvoiceService(invoiceData) {
  try {
    const { maintenanceId } = invoiceData;
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const invoiceRepository = AppDataSource.getRepository(Invoice);

    const maintenance = await maintenanceRepository.findOne({ where: { id: maintenanceId } });
    if (!maintenance) return [null, "Mantenimiento no encontrado"];

    const newInvoice = invoiceRepository.create({ ...invoiceData, maintenance });
    await invoiceRepository.save(newInvoice);

    return [newInvoice, null];
  } catch (error) {
    console.error("Error al crear la factura:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateInvoiceService(id, invoiceData) {
  try {
    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const invoice = await invoiceRepository.findOne({ where: { id }, relations: ["maintenance"] });
    if (!invoice) return [null, "Factura no encontrada"];

    const updatedData = { ...invoiceData, updatedAt: new Date() };
    await invoiceRepository.update({ id }, updatedData);

    return [{ ...invoice, ...updatedData }, null];  // Retorna el objeto actualizado
  } catch (error) {
    console.error("Error al actualizar la factura:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteInvoiceService(id) {
  try {
    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const invoice = await invoiceRepository.findOne({ where: { id } });

    if (!invoice) {
      return [null, { type: "not_found", message: "Factura no encontrada" }];
    }

    await invoiceRepository.remove(invoice);
    return [invoice, null];

  } catch (error) {
    console.error("Error al eliminar la factura:", error);

    // Manejo del error de violación de clave foránea
    if (error.code === "23503") { // Código de error de clave foránea en PostgreSQL
      return [null, {
        type: "foreign_key_violation",
        message: `No se puede eliminar la factura con ID ${id} porque está referenciada en otra tabla.`,
        detail: error.detail,
        constraint: error.constraint
      }];
    }

    return [null, { type: "server_error", message: "Error interno del servidor" }];
  }
}
