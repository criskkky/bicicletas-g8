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
    const { NameClient, problemDescription, timeSpent, status } = req.body;
    if (!NameClient || !problemDescription || !timeSpent || !status) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [order, error] = await createOrderService(req.body);
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
    const { NameClient, problemDescription, timeSpent, status } = req.body;
    if (!NameClient && !problemDescription && !timeSpent && !status) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [order, error] = await updateOrderService(id, req.body);
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
