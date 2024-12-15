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

    if (!rut_cliente || !rut_trabajador || !fecha_mantenimiento || !descripcion) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const { success, maintenance, invoice, order, message } = await createMaintenanceService({
      rut_cliente,
      rut_trabajador,
      fecha_mantenimiento,
      descripcion,
      items,
    });

    if (!success) {
      console.error("Error al crear mantenimiento:", message);
      return res.status(500).json({ error: message || "Error interno del servidor" });
    }

    console.log("Mantenimiento creado con éxito:", maintenance);
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

    console.log("Mantenimiento obtenido:", maintenance);
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
      console.warn("No se encontraron mantenimientos registrados.");
      return res.json([]); // Devolver un array vacío si no hay mantenimientos
    }

    console.log("Mantenimientos obtenidos:", maintenances);
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

    console.log("Datos recibidos para actualización:", updateData);

    if (!updateData.rut_trabajador || !updateData.rut_cliente || !updateData.fecha_mantenimiento) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const { success, maintenance, invoice, order, message } = await updateMaintenanceService(id, updateData);

    if (!success) {
      console.error("Error al actualizar mantenimiento:", message);
      return res.status(400).json({ error: message || "Error al actualizar el mantenimiento" });
    }

    console.log("Mantenimiento actualizado:", maintenance);
    res.json({ message: "Mantenimiento actualizado con éxito", maintenance, invoice, order });
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
      console.error("Error al eliminar mantenimiento:", message);
      return res.status(404).json({ error: message });
    }

    console.log("Mantenimiento eliminado exitosamente:", id);
    return res.json({ message: "Mantenimiento eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el mantenimiento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
