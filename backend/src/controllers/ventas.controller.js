"use strict";
import {
  createSaleService,
  deleteSaleService,
  getAllSalesService,
  getSaleService,
  updateSaleService,
} from "../services/ventas.service.js";

// Crear una venta
export async function createSale(req, res) {
  try {
    const { rut_cliente, rut_trabajador, fecha_venta, items, metodo_pago } = req.body;

    // Validación de campos obligatorios
    if (!rut_cliente || !rut_trabajador || !fecha_venta) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [sale, invoice, order, error] = await createSaleService({
      rut_cliente,
      rut_trabajador,
      fecha_venta,
      items,
      metodo_pago,
    });

    if (error) {
      console.error("Error al crear la venta:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    res.status(201).json({ message: "Venta creada con éxito", sale, invoice, order });
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Obtener todas las ventas
export async function getAllSales(req, res) {
  try {
    const sales = await getAllSalesService();

    if (!sales || sales.length === 0) {
      return res.status(404).json({ error: "No se encontraron ventas" });
    }

    res.json(sales);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Obtener una venta específica
export async function getSale(req, res) {
  try {
    const { id } = req.params;

    const sale = await getSaleService(id);

    if (!sale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    res.json(sale);
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Actualizar una venta
export async function updateSale(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validación de campos obligatorios
    if (!updateData.rut_trabajador || !updateData.rut_cliente || !updateData.fecha_venta) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [updatedSale, updatedInvoice, updatedOrder, error] = await updateSaleService(id, updateData);

    if (error) {
      console.error("Error al actualizar la venta:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (!updatedSale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    res.json({ message: "Venta actualizada con éxito", updatedSale, updatedInvoice, updatedOrder });
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Eliminar una venta
export async function deleteSale(req, res) {
  try {
    const { id } = req.params;

    const { success, message } = await deleteSaleService(id);

    if (!success) {
      return res.status(404).json({ error: message });
    }

    res.json({ message: "Venta eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
