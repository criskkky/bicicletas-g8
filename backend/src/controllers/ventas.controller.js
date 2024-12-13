"use strict";
import {
  createSaleService,
  deleteSaleService,
  getAllSalesService,
  getSaleService,
  updateSaleService,
} from "../services/ventas.service.js";

export async function createSale(req, res) {
  try {
    const { rut_cliente, rut_trabajador, fecha_venta, items } = req.body;

    // Validación de campos obligatorios, `items` es obligatorio
    if (!rut_cliente || !rut_trabajador || !fecha_venta || !items || items.length === 0) {
      return res.status(400).json({ error: "Faltan campos obligatorios o no se proporcionaron items." });
    }

    // Llamada al servicio para crear la venta
    const [sale, invoice, order, error] = await createSaleService({
      rut_cliente,
      rut_trabajador,
      fecha_venta,
      items,
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

export async function getSale(req, res) {
  try {
    const { id } = req.params;
    const sale = await getSaleService(id);

    if (!sale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    return res.json(sale);
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllSales(req, res) {
  try {
    const sales = await getAllSalesService();

    if (!sales || sales.length === 0) {
      return res.status(404).json({ error: "No se encontraron ventas" });
    }

    return res.json(sales);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateSale(req, res) {
  const { id } = req.params;

  try {
    // Obtén la venta existente
    const currentSale = await getSaleService(id);

    if (!currentSale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    // Mezcla los valores existentes con los nuevos valores proporcionados
    const updatedData = {
      id_venta: currentSale.id_venta,
      rut_cliente: req.body.rut_cliente ?? currentSale.rut_cliente,
      rut_trabajador: req.body.rut_trabajador ?? currentSale.rut_trabajador,
      fecha_venta: req.body.fecha_venta ?? currentSale.fecha_venta,
      items: req.body.items ?? currentSale.items, // Si no se proporciona, se mantiene el actual
    };

    if (!updatedData.items || updatedData.items.length === 0) {
      return res.status(400).json({ error: "Se deben proporcionar items para la venta." });
    }

    const { success, sale, message } = await updateSaleService(id, updatedData);

    if (!success) {
      return res.status(400).json({ error: message });
    }

    return res.json({ message: "Venta actualizada con éxito", sale });
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteSale(req, res) {
  try {
    const { id } = req.params;
    const { success, message } = await deleteSaleService(id);

    if (!success) {
      return res.status(404).json({ error: message });
    }

    return res.json({ message: "Venta eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
