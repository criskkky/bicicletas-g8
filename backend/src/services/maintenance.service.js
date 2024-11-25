import { AppDataSource } from "../config/configDb.js";
import Maintenance from "../entity/maintenance.entity.js";
import MaintenanceInventory from "../entity/maintenanceinventory.entity.js";
import InventoryItem from "../entity/inventory.entity.js";

// Función para ajustar inventario
async function ajustarInventario(inventoryItemId, quantityChange) {
  const inventoryRepository = AppDataSource.getRepository(InventoryItem);
  const item = await inventoryRepository.findOne({ where: { id: inventoryItemId } });

  if (!item) return { success: false, message: "Artículo no encontrado" };
  if (item.quantity + quantityChange < 0) return { success: false, message: "Inventario insuficiente" };

  item.quantity += quantityChange;
  await inventoryRepository.save(item);
  return { success: true, item };
}

// Función para revertir los cambios de inventario de un mantenimiento
async function revertirInventario(maintenance) {
  const inventoryRepository = AppDataSource.getRepository(MaintenanceInventory);
  const inventoryItems = await inventoryRepository.find({ where: 
    { maintenance: { id: maintenance.id } }, relations: ["inventoryItem"] });

  for (const item of inventoryItems) {
    const inventoryAdjustment = await ajustarInventario(item.inventoryItem.id, item.quantityUsed);
    if (!inventoryAdjustment.success) {
      return { success: false, message: inventoryAdjustment.message };
    }
  }

  return { success: true };
}

// Crear mantenimiento
export async function createMaintenanceService(data) {
  const { description, technician, status, date, inventoryItems } = data;
  const maintenanceRepository = AppDataSource.getRepository(Maintenance);
  const inventoryRepository = AppDataSource.getRepository(MaintenanceInventory);

  try {
    const maintenance = maintenanceRepository.create({ description, technician, status, date });
    await maintenanceRepository.save(maintenance);

    for (const item of inventoryItems) {
      const { inventory_id, quantityUsed } = item;
      const inventoryAdjustment = await ajustarInventario(inventory_id, -quantityUsed);
      if (!inventoryAdjustment.success) {
        throw new Error(inventoryAdjustment.message);
      }

      const maintenanceInventory = inventoryRepository.create({
        maintenance,
        inventoryItem: inventoryAdjustment.item,
        quantityUsed,
      });
      await inventoryRepository.save(maintenanceInventory);
    }

    return [maintenance, null];
  } catch (error) {
    return [null, error.message];
  }
}

// Obtener un mantenimiento
export async function getMaintenanceService(id) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({ where: { id }, relations: ["inventoryItems"] });
    if (!maintenance) return [null, "Mantenimiento no encontrado"];
    return [maintenance, null];
  } catch (error) {
    console.error("Error al obtener el mantenimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener todos los mantenimientos con las relaciones de items usados
export async function getAllMaintenanceService() {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenances = await maintenanceRepository.find({
      relations: ["inventoryItems"], // Asegúrate de que el campo de la relación se llame 'inventoryItems'
    });

    if (maintenances.length === 0) {
      return [null, "No se encontraron mantenimientos"];
    }

    return [maintenances, null];
  } catch (error) {
    console.error("Error al obtener los mantenimientos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar mantenimiento
export async function updateMaintenanceService(id, maintenanceData) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({ where: { id } });
    if (!maintenance) return [null, "Mantenimiento no encontrado"];

    maintenanceRepository.merge(maintenance, maintenanceData);
    await maintenanceRepository.save(maintenance);
    return [maintenance, null];
  } catch (error) {
    console.error("Error al actualizar el mantenimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar mantenimiento
export async function deleteMaintenanceService(id) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({ where: { id }, relations: ["inventoryItems"] });

    if (!maintenance) return [null, { type: "not_found", message: "Mantenimiento no encontrado" }];

    // Revertir el inventario
    const revertResult = await revertirInventario(maintenance);
    if (!revertResult.success) {
      return [null, { type: "inventory_error", message: revertResult.message }];
    }

    // Eliminar el mantenimiento
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
