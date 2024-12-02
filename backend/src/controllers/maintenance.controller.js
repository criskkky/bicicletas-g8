"use strict";
import {
  createMaintenanceService,
  deleteMaintenanceService,
  getAllMaintenanceService,
  getMaintenanceService,
  updateMaintenanceService,
} from "../services/maintenance.service.js";
import { createOrderService } from "../services/order.service.js";

export async function createMaintenance(req, res) {
  try {
    const { id_cliente, rut, fecha_mantenimiento, descripcion, inventoryItems } = req.body;

    if (!id_cliente || !rut || !fecha_mantenimiento || !descripcion || !Array.isArray(inventoryItems)) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Crear el mantenimiento
    const [maintenance, maintenanceError] = await createMaintenanceService(req.body);

    if (maintenanceError) {
      return res.status(400).json({ error: maintenanceError });
    }

    // Crear la orden correspondiente al mantenimiento
    const [order, orderError] = await createOrderService({
      rut: rut,
      id_mantenimiento: maintenance.id_mantenimiento,
      fecha_orden: new Date().toISOString().split("T")[0],
      tipo_orden: "mantenimiento",
      total: 0, // Ajustar el total si es necesario
    });

    if (orderError) {
      return res.status(500).json({ error: "Error al crear la orden asociada" });
    }

    res.status(201).json({ message: "Mantenimiento y orden creadas con éxito", maintenance, order });
  } catch (error) {
    console.error("Error al crear el mantenimiento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}


export async function getMaintenance(req, res) {
  try {
    const { id } = req.params;
    const [maintenance, error] = await getMaintenanceService(id);
    if (error) {
      return res.status(404).json({ error: "Mantenimiento no encontrado" });
    }
    return res.json(maintenance);
  } catch (error) {
    console.error("Error al obtener el mantenimiento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllMaintenance(req, res) {
  try {
    const [maintenances, error] = await getAllMaintenanceService();
    if (error) {
      return res.status(404).json({ error: "No se encontraron mantenimientos" });
    }
    return res.json(maintenances);
  } catch (error) {
    console.error("Error al obtener los mantenimientos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateMaintenance(req, res) {
  const { id } = req.params;
  const { id_cliente, rut, fecha_mantenimiento, descripcion, inventoryItems } = req.body;

  // Validación de ID y datos
  if (!id || !id_cliente || !rut || !fecha_mantenimiento || !descripcion || !Array.isArray(inventoryItems)) {
    return res.status(400).json({ error: "Datos incompletos o inválidos" });
  }

  // Llamada al servicio de actualización de mantenimiento
  const [maintenance, error] = await updateMaintenanceService(id, {
    id_cliente,
    rut,
    fecha_mantenimiento,
    descripcion,
    inventoryItems
  });

  if (error) {
    if (error.type === "not_found") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(400).json({ error: error.message });
  }

  return res.json(maintenance);
}

export async function deleteMaintenance(req, res) {
  try {
    const { id } = req.params;
    const [maintenance, error] = await deleteMaintenanceService(id);

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

    return res.json({ message: "Mantenimiento eliminado exitosamente", maintenance });
  } catch (error) {
    console.error("Error al eliminar el mantenimiento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
