"use strict";

import {
  createSaleService,
  deleteSaleService,
  getAllSalesService,
  getSaleByIdService,
  restarInventarioService,
  updateSaleService,
  verificarInventarioService,
} from "../services/sale.service.js";

import { createOrderService } from "../services/order.service.js";

export async function createSale(req, res) {
  try {
    const { id_cliente, fecha_venta, total, tipo_venta, inventoryItems } = req.body;

    // Validar campos obligatorios
    if (!id_cliente || !fecha_venta || total === undefined || !tipo_venta || !Array.isArray(inventoryItems)) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Verificar inventario para cada ítem
    for (const item of inventoryItems) {
      const { id_item, cantidad } = item;
      const [hayInventario, errorInventario] = await verificarInventarioService(id_item, cantidad);
      if (errorInventario || !hayInventario) {
        return res.status(400).json({
          error: `No hay suficiente inventario para el ítem con ID ${id_item}`,
        });
      }
    }

    // Restar inventario
    for (const item of inventoryItems) {
      await restarInventarioService(item.id_item, item.cantidad);
    }

    // Crear la venta
    const [sale, saleError] = await createSaleService(req.body);
    if (saleError) {
      return res.status(400).json({ error: saleError });
    }

    // Crear la orden asociada
    const [order, orderError] = await createOrderService({
      rut: req.user?.id, // Usuario responsable de la venta
      id_venta: sale.id_venta,
      fecha_orden: new Date().toISOString().split("T")[0],
      tipo_orden: "venta",
      total: sale.total,
    });

    if (orderError) {
      return res.status(500).json({ error: "Error al crear la orden asociada" });
    }

    res.status(201).json({ message: "Venta y orden creadas con éxito", sale, order });
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllSales(req, res) {
  try {
    const [sales, error] = await getAllSalesService();
    if (error) return res.status(400).json({ error });
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return res.status(500).json({ error: "Error al obtener las ventas" });
  }
}

export async function getSaleById(req, res) {
  try {
    const { id } = req.params;
    const [sale, error] = await getSaleByIdService(id);
    if (error) return res.status(404).json({ error });
    res.status(200).json(sale);
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return res.status(500).json({ error: "Error al obtener la venta" });
  }
}

export async function updateSale(req, res) {
  try {
    const { id } = req.params;
    const { inventoryItems, ...updateData } = req.body;

    // Validar campos requeridos
    if (!inventoryItems || !Array.isArray(inventoryItems)) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Actualizar inventario
    for (const item of inventoryItems) {
      const { id_item, cantidad } = item;
      await restarInventarioService(id_item, cantidad);
    }

    // Actualizar la venta
    const [sale, error] = await updateSaleService(id, { ...updateData, inventoryItems });
    if (error) return res.status(404).json({ error: "Venta no encontrada" });
    res.status(200).json(sale);
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    return res.status(500).json({ error: "Error al actualizar la venta" });
  }
}

export async function deleteSale(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de venta necesario" });
    }

    const [sale, error] = await deleteSaleService(id);
    if (error) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    res.status(200).json({ message: "Venta eliminada exitosamente", sale });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return res.status(500).json({ error: "Error al eliminar la venta" });
  }
}
