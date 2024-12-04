"use strict";

import {
  createSaleService,
  deleteSaleService,
  getAllSalesService,
  getSaleByIdService,
  updateSaleService,
} from "../services/ventas.service.js";

export async function createSale(req, res) {
  try {
    const { rut_cliente, fecha_venta, items, rut_trabajador } = req.body;

    // Validar campos obligatorios
    if (!rut_cliente || !fecha_venta || !Array.isArray(items) || items.length === 0 || !rut_trabajador) {
      return res.status(400).json({ error: "Faltan campos requeridos o los ítems están vacíos" });
    }

    // Crear la venta
    const [sale, saleError] = await createSaleService({
      rut_cliente,
      fecha_venta,
      items,
      rut_trabajador,
    });

    if (saleError) {
      return res.status(400).json({ error: saleError });
    }

    res.status(201).json({ message: "Venta creada con éxito", sale });
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteSale(req, res) {
  try {
    const { id } = req.params;

    // Eliminar la venta
    const [sale, error] = await deleteSaleService(id);
    if (error) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    res.status(200).json({ message: "Venta y orden eliminadas exitosamente", sale });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return res.status(500).json({ error: "Error interno al eliminar la venta" });
  }
}

export async function getAllSales(req, res) {
  try {
    const [sales, error] = await getAllSalesService();
    if (error) {
      return res.status(500).json({ error: "Error al obtener las ventas" });
    }

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return res.status(500).json({ error: "Error interno al obtener las ventas" });
  }
}

export async function getSaleById(req, res) {
  try {
    const { id } = req.params;

    const [sale, error] = await getSaleByIdService(id);
    if (error) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    res.status(200).json(sale);
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return res.status(500).json({ error: "Error interno al obtener la venta" });
  }
}

export async function updateSale(req, res) {
  try {
    const { id } = req.params;
    const { rut_cliente, fecha_venta, items, rut_trabajador } = req.body;

    // Validar que al menos un campo se haya proporcionado
    if (!rut_cliente && !fecha_venta && (!items || items.length === 0) && !rut_trabajador) {
      return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
    }

    // Actualizar la venta
    const [sale, error] = await updateSaleService(id, {
      rut_cliente,
      fecha_venta,
      items,
      rut_trabajador,
    });

    if (error) {
      return res.status(404).json({ error });
    }

    res.status(200).json({ message: "Venta actualizada con éxito", sale });
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
