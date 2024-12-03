"use strict";
import {
  createMaintenanceService,
  deleteMaintenanceService,
  getAllMaintenanceService,
  getMaintenanceService,
  updateMaintenanceService,
} from "../services/mantenimiento.service.js";
import { createOrderService } from "../services/orden.service.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";

export async function createMaintenance(req, res) {
  try {
    const { rut_cliente, rut, fecha_mantenimiento, descripcion, inventoryItems } = req.body;
    console.log("Inicio de creación de mantenimiento, RUT del trabajador:", rut);

    if (!rut_cliente || !rut || !fecha_mantenimiento || !descripcion || !Array.isArray(inventoryItems) || inventoryItems.length === 0) {
      return res.status(400).json({ error: "Faltan campos obligatorios o el formato de inventario no es correcto" });
    }

    const [maintenance, error] = await createMaintenanceService({
      rut_cliente,
      rut,
      fecha_mantenimiento,
      descripcion,
      inventoryItems
    });

    if (error) {
      console.error("Error al crear mantenimiento:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    console.log("Mantenimiento creado con éxito");
    res.status(201).json({ message: "Mantenimiento creado con éxito", maintenance });
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
  const { rut_cliente, rut, fecha_mantenimiento, descripcion, inventoryItems } = req.body;

  // Validación de ID y datos
  if (!id || !rut_cliente || !rut || !fecha_mantenimiento || !descripcion || !Array.isArray(inventoryItems) || inventoryItems.length === 0) {
    return res.status(400).json({ error: "Datos incompletos o inválidos" });
  }

  // Llamada al servicio de actualización de mantenimiento
  const [maintenance, error] = await updateMaintenanceService(id, {
    rut_cliente,
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
