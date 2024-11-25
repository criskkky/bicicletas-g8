"use strict";
import {
  createMaintenanceService,
  deleteMaintenanceService,
  getAllMaintenanceService,
  getMaintenanceService,
  updateMaintenanceService
} from "../services/maintenance.service.js";

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

export async function createMaintenance(req, res) {
  const { description, technician, status, date, inventoryItems } = req.body;

  // Validación de datos de entrada
  if (!description || !technician || !date || !Array.isArray(inventoryItems) || inventoryItems.length === 0) {
    return res.status(400).json({ error: "Datos incompletos o inválidos" });
  }

  // Llamada al servicio de creación de mantenimiento
  const [maintenance, error] = await createMaintenanceService(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  return res.status(201).json(maintenance);
}

export async function updateMaintenance(req, res) {
  const { id } = req.params;
  const maintenanceData = req.body;

  // Validación de ID y datos
  if (!id || !maintenanceData) {
    return res.status(400).json({ error: "Datos incompletos o inválidos" });
  }

  // Llamada al servicio de actualización de mantenimiento
  const [maintenance, error] = await updateMaintenanceService(id, maintenanceData);

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
