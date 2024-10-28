
"use strict";
import {
  getOrderService,
  getAllOrdersService,
  createOrderService,
  updateOrderService,
  deleteOrderService
} from "../services/order.service.js";

export async function getOrder(req, res) {
  try {
    const { id } = req.params;
    const [order, error] = await getOrderService(id);
    if (error) return res.status(404).json({ error });
    res.json(order);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllOrders(req, res) {
  try {
    const [orders, error] = await getAllOrdersService();
    if (error) return res.status(404).json({ error });
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createOrder(req, res) {
  const { customerName, problemDescription, serviceDetails, technician } = req.body;

  // Validación simple
  if (!customerName || !problemDescription) {
    return res.status(400).json({ error: "Datos inválidos para la orden." });
  }

  try {
    const [order, error] = await createOrderService(req.body);
    if (error) return res.status(400).json({ error });
    res.status(201).json(order);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    
    const [order, error] = await updateOrderService(id, req.body);
    if (error) return res.status(404).json({ error });
    res.json(order);
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const [order, error] = await deleteOrderService(id);
    if (error) return res.status(404).json({ error });
    res.json({ message: "Orden eliminada exitosamente", order });
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
