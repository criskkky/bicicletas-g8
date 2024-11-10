import { AppDataSource } from "../config/configDb.js";
import Maintenance from "../entity/maintenance.entity.js";

export async function getMaintenanceService(id) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({ where: { id } });
    if (!maintenance) return [null, "Mantenimiento no encontrado"];
    return [maintenance, null];
  } catch (error) {
    console.error("Error al obtener el mantenimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllMaintenanceService() {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenances = await maintenanceRepository.find();
    if (maintenances.length === 0) return [null, "No se encontraron mantenimientos"];
    return [maintenances, null];
  } catch (error) {
    console.error("Error al obtener los mantenimientos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createMaintenanceService(maintenanceData) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const newMaintenance = maintenanceRepository.create(maintenanceData);
    await maintenanceRepository.save(newMaintenance);
    return [newMaintenance, null];
  } catch (error) {
    console.error("Error al crear el mantenimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateMaintenanceService(id, maintenanceData) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({ where: { id } });
    if (!maintenance) return [null, "Mantenimiento no encontrado"];

    const updatedData = { ...maintenanceData, updatedAt: new Date() };
    await maintenanceRepository.update({ id }, updatedData);

    return [{ ...maintenance, ...updatedData }, null];  // Retorna el objeto actualizado
  } catch (error) {
    console.error("Error al actualizar el mantenimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteMaintenanceService(id) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({ where: { id } });

    if (!maintenance) {
      return [null, { type: "not_found", message: "Mantenimiento no encontrado" }];
    }

    await maintenanceRepository.remove(maintenance);
    return [maintenance, null];

  } catch (error) {
    console.error("Error al eliminar el mantenimiento:", error);

    // Manejo del error de violación de clave foránea
    if (error.code === "23503") { // Código de error de clave foránea en PostgreSQL
      return [null, {
        type: "foreign_key_violation",
        message: `No se puede eliminar el mantenimiento con ID ${id} porque está referenciado en otra tabla.`,
        detail: error.detail,
        constraint: error.constraint
      }];
    }

    return [null, { type: "server_error", message: "Error interno del servidor" }];
  }
}
