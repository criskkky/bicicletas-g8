"use strict";
import {
  createMaintenanceService,
  deleteMaintenanceService,
  getAllMaintenanceService,
  getMaintenanceService,
  updateMaintenanceService,
} from "../services/mantenimiento.service.js";

export async function createMaintenance(req, res) {
  try {
    const { rut_cliente, rut_trabajador, fecha_mantenimiento, descripcion, items } = req.body;

    // Validación de campos obligatorios, `items` es opcional
    if (!rut_cliente || !rut_trabajador || !fecha_mantenimiento || !descripcion) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Llamada al servicio para crear mantenimiento
    const [maintenance, invoice, order, error] = await createMaintenanceService({
      rut_cliente,
      rut_trabajador,
      fecha_mantenimiento,
      descripcion,
      items, // Puede ser nulo
    });

    if (error) {
      console.error("Error al crear mantenimiento:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    res.status(201).json({ message: "Mantenimiento creado con éxito", maintenance, invoice, order });
  } catch (error) {
    console.error("Error al crear el mantenimiento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getMaintenance(req, res) {
  try {
    const { id } = req.params;
    const maintenance = await getMaintenanceService(id);

    if (!maintenance) {
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
    const maintenances = await getAllMaintenanceService();

    if (!maintenances || maintenances.length === 0) {
      return res.status(404).json({ error: "No se encontraron mantenimientos" });
    }

    return res.json(maintenances);
  } catch (error) {
    console.error("Error al obtener los mantenimientos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await updateMaintenanceService(id, updateData);

    console.log("Datos recibidos para actualización:", JSON.stringify(updateData));

    // Validación de datos
    if (!updateData.rut_trabajador || !updateData.rut_cliente || !updateData.fecha_mantenimiento) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Intenta actualizar el mantenimiento
    const updatedMaintenance = await updateMaintenanceService(id, updateData);

    if (!updatedMaintenance) {
      return res.status(404).json({ error: "Mantenimiento no encontrado" });
    }

    console.log("Mantenimiento actualizado:", JSON.stringify(updatedMaintenance));

    res.json(updatedMaintenance);
  } catch (error) {
    console.error("Error al actualizar mantenimiento:", error);
    res.status(400).json({ error: error.message || "Error al actualizar el mantenimiento" });
  }
};

export async function deleteMaintenance(req, res) {
  try {
    const { id } = req.params;
    const { success, message } = await deleteMaintenanceService(id);

    if (!success) {
      return res.status(404).json({ error: message });
    }

    return res.json({ message: "Mantenimiento eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el mantenimiento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
