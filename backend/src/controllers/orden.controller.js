/* eslint-disable operator-linebreak */
"use strict";
import {
  createOrderService,
  deleteOrderService,
  getAllOrdersService,
  getOrderService,
  updateOrderService,
} from "../services/orden.service.js";

export async function getOrder(req, res) {
  try {
    const { id } = req.params;
    const [order, error] = await getOrderService(id);
    if (error) {
      return res.status(404).json({ error });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllOrders(req, res) {
  try {
    const [orders, error] = await getAllOrdersService();
    if (error) {
      return res.status(404).json({ error });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createOrder(req, res) {
  try {
    const {
      id_mantenimiento,
      id_venta,
      fecha_orden,
      tipo_orden,
      total,
      hora_inicio,
      hora_fin,
      rut_trabajador,
    } = req.body;

    // Validación de campos obligatorios según el tipo de orden
    if (!tipo_orden || !fecha_orden || total === undefined || !rut_trabajador) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (tipo_orden === "venta" && !id_venta) {
      return res.status(400).json({ error: "El ID de la venta es obligatorio para una orden de tipo 'venta'" });
    }

    if (tipo_orden === "mantenimiento" && !id_mantenimiento) {
      return res.status(400).json({ error: "El ID del mantenimiento es obligatorio para una orden de tipo 'mantenimiento'" });
    }

    const [order, error] = await createOrderService({
      id_mantenimiento,
      id_venta,
      fecha_orden,
      tipo_orden,
      total,
      hora_inicio,
      hora_fin,
      rut_trabajador,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(201).json({ message: "Orden creada con éxito", order });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const {
      id_mantenimiento,
      id_venta,
      fecha_orden,
      tipo_orden,
      total,
      hora_inicio,
      hora_fin,
      estado_orden,
      rut_trabajador,
    } = req.body;

    // Validar que al menos un campo se haya proporcionado para actualizar
    if (
      !id_mantenimiento &&
      !id_venta &&
      !fecha_orden &&
      !tipo_orden &&
      total === undefined &&
      !hora_inicio &&
      !hora_fin &&
      !estado_orden &&
      !rut_trabajador
    ) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [order, error] = await updateOrderService(id, {
      id_mantenimiento,
      id_venta,
      fecha_orden,
      tipo_orden,
      total,
      hora_inicio,
      hora_fin,
      estado_orden,
      rut_trabajador,
    });

    if (error) {
      return res.status(404).json({ error });
    }

    return res.status(200).json({ message: "Orden actualizada con éxito", order });
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
      return res.status(404).json({ error });
    }
    return res.status(200).json({ message: "Orden eliminada exitosamente", order });
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
