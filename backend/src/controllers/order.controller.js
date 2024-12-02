"use strict";
import {
  createOrderService,
  deleteOrderService,
  getAllOrdersService,
  getOrderService,
  updateOrderService,
} from "../services/order.service.js";

export async function getOrder(req, res) {
  try {
    const { id } = req.params;
    const [order, error] = await getOrderService(id);
    if (error) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    return res.json(order);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllOrders(req, res) {
  try {
    const [orders, error] = await getAllOrdersService();
    if (error) {
      return res.status(404).json({ error: "No se encontraron órdenes" });
    }
    return res.json(orders);
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createOrder(req, res) {
  try {
    const { rut, id_mantenimiento, id_venta, fecha_orden, tipo_orden, total } = req.body;

    // Validación de campos obligatorios según el tipo de orden
    if (!rut || !tipo_orden || !fecha_orden || total === undefined) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Validar la relación entre id_venta y id_mantenimiento
    if (tipo_orden === "venta" && !id_venta) {
      return res.status(400).json({ error: "El ID de la venta es obligatorio para una orden de tipo 'venta'" });
    }

    if (tipo_orden === "mantenimiento" && !id_mantenimiento) {
      return res.status(400).json({ error: "El ID del mantenimiento es obligatorio para una orden de tipo 'mantenimiento'" });
    }

    // Crear la orden
    const [order, error] = await createOrderService({
      rut,
      id_mantenimiento,
      id_venta,
      fecha_orden,
      tipo_orden,
      total,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(201).json(order);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const { rut, id_mantenimiento, id_venta, fecha_orden, tipo_orden, total } = req.body;

    if (!rut && !id_mantenimiento && !id_venta && !fecha_orden && !tipo_orden && total === undefined) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [order, error] = await updateOrderService(id, {
      rut,
      id_mantenimiento,
      id_venta,
      fecha_orden,
      tipo_orden,
      total,
    });

    if (error) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    return res.json(order);
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const [order, error] = await deleteOrderService(id);
    if (error) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    return res.json({ message: "Orden eliminada exitosamente", order });
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
