"use strict";
import {
  createInvoiceService,
  deleteInvoiceService,
  getAllInvoicesService,
  getInvoiceService,
  updateInvoiceService
} from "../services/invoice.service.js";

export async function getInvoice(req, res) {
  try {
    const { id } = req.params;
    const [invoice, error] = await getInvoiceService(id);
    if (error) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    return res.json(invoice);
  } catch (error) {
    console.error("Error al obtener la factura:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllInvoices(req, res) {
  try {
    const [invoices, error] = await getAllInvoicesService();
    if (error) {
      return res.status(404).json({ error: "No se encontraron facturas" });
    }
    return res.json(invoices);
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createInvoice(req, res) {
  try {
    const { totalAmount, issueDate, maintenanceId } = req.body;
    if (!totalAmount || !issueDate || !maintenanceId) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [invoice, error] = await createInvoiceService(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(201).json(invoice);
  } catch (error) {
    console.error("Error al crear la factura:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateInvoice(req, res) {
  try {
    const { id } = req.params;
    const { totalAmount, issueDate } = req.body;

    if (!totalAmount && !issueDate) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [invoice, error] = await updateInvoiceService(id, req.body);
    if (error) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    return res.json(invoice);

  } catch (error) {
    console.error("Error al actualizar la factura:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteInvoice(req, res) {
  try {
    const { id } = req.params;
    const [invoice, error] = await deleteInvoiceService(id);

    if (error) {
      if (error.type === "not_found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.type === "foreign_key_violation") {
        return res.status(400).json({
          error: error.message,
          detail: error.detail,
          constraint: error.constraint
        });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: "Factura eliminada exitosamente", invoice });

  } catch (error) {
    console.error("Error al eliminar la factura:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
