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
    const { rut_cliente, rut, fecha_mantenimiento, descripcion, inventoryItems } = req.body;
    console.log("Inicio de creación de mantenimiento, RUT del trabajador:", rut);

    // Validación de campos obligatorios, `inventoryItems` es opcional
    if (!rut_cliente || !rut || !fecha_mantenimiento || !descripcion) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Llamada al servicio para crear mantenimiento
    const [maintenance, invoice, order, error] = await createMaintenanceService({
      rut_cliente,
      rut,
      fecha_mantenimiento,
      descripcion,
      inventoryItems, // Puede ser nulo
    });

    if (error) {
      console.error("Error al crear mantenimiento:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    console.log("Mantenimiento creado con éxito");
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

export async function updateMaintenance(req, res) {
  const { id } = req.params;

  try {
    // Obtén el mantenimiento existente
    const currentMaintenance = await getMaintenanceService(id);

    if (!currentMaintenance) {
      return res.status(404).json({ error: "Mantenimiento no encontrado" });
    }

    // Mezcla los valores existentes con los nuevos valores proporcionados
    const updatedData = {
      rut_cliente: req.body.rut_cliente ?? currentMaintenance.rut_cliente,
      rut: req.body.rut ?? currentMaintenance.rut,
      fecha_mantenimiento: req.body.fecha_mantenimiento ?? currentMaintenance.fecha_mantenimiento,
      descripcion: req.body.descripcion ?? currentMaintenance.descripcion,
      inventoryItems: req.body.inventoryItems ?? currentMaintenance.inventoryItems, // Si no se proporciona, se mantiene el actual
    };

    const { success, maintenance, message } = await updateMaintenanceService(id, updatedData);

    if (!success) {
      return res.status(400).json({ error: message });
    }

    return res.json({ message: "Mantenimiento actualizado con éxito", maintenance });
  } catch (error) {
    console.error("Error al actualizar el mantenimiento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

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
