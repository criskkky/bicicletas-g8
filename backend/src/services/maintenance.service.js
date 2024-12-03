import { AppDataSource } from "../config/configDb.js";
import Maintenance from "../entity/maintenance.entity.js";
import MaintenanceInventory from "../entity/maintenance_inventory.entity.js";
import InventoryItem from "../entity/inventory.entity.js";

// Ajustar inventario
async function ajustarInventario(inventoryItemId, quantityChange) {
  const inventoryRepository = AppDataSource.getRepository(InventoryItem);
  const item = await inventoryRepository.findOne({ where: { id_item: inventoryItemId } });

  if (!item) return { success: false, message: "Artículo no encontrado" };
  if (item.stock + quantityChange < 0) return { success: false, message: "Inventario insuficiente" };

  item.stock += quantityChange;
  await inventoryRepository.save(item);
  return { success: true, item };
}

// Revertir inventario
async function revertirInventario(maintenance) {
  const inventoryRepository = AppDataSource.getRepository(MaintenanceInventory);
  const inventoryItems = await inventoryRepository.find({
    where: { id_mantenimiento: maintenance.id_mantenimiento },
    relations: ["inventoryItem"],
  });

  for (const item of inventoryItems) {
    const inventoryAdjustment = await ajustarInventario(item.inventoryItem.id_item, item.cantidad);
    if (!inventoryAdjustment.success) {
      return { success: false, message: inventoryAdjustment.message };
    }
  }

  return { success: true };
}

// Crear mantenimiento
export async function createMaintenanceService(data) {
  const maintenanceRepository = AppDataSource.getRepository(Maintenance);
  const inventoryRepository = AppDataSource.getRepository(MaintenanceInventory);

  try {
    // Verificar usuario
    const userExists = await userRepository.findOne({ where: { rut: data.rut } });
    if (!userExists) {
      throw new Error("Usuario no encontrado");
    }

    // Crear mantenimiento
    const maintenance = maintenanceRepository.create({
      rut: data.rut,
      id_cliente: data.id_cliente,
      fecha_mantenimiento: data.fecha_mantenimiento,
      descripcion: data.descripcion,
    });
    await maintenanceRepository.save(maintenance);

    // Gestionar inventario
    for (const item of data.inventoryItems) {
      const inventoryItem = await inventoryRepository.findOne({ where: { id_item: item.id_item } });
      if (!inventoryItem) {
        throw new Error(`Ítem de inventario con ID ${item.id_item} no encontrado`);
      }

      // Relación con mantenimiento
      const maintenanceInventory = inventoryRepository.create({
        id_mantenimiento: maintenance.id_mantenimiento,
        id_item: item.id_item,
        cantidad: item.cantidad,
      });
      await inventoryRepository.save(maintenanceInventory);
    }

    return [maintenance, null];
  } catch (error) {
    console.error("Error al crear mantenimiento:", error);
    return [null, error.message];
  }
}

// Obtener un mantenimiento
export async function getMaintenanceService(id_mantenimiento) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({
      where: { id_mantenimiento },
      relations: ["inventoryItems"],
    });
    if (!maintenance) return [null, "Mantenimiento no encontrado"];
    return [maintenance, null];
  } catch (error) {
    console.error("Error al obtener el mantenimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener todos los mantenimientos
export async function getAllMaintenanceService() {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenances = await maintenanceRepository.find({ relations: ["inventoryItems"] });

    if (maintenances.length === 0) return [null, "No se encontraron mantenimientos"];
    return [maintenances, null];
  } catch (error) {
    console.error("Error al obtener los mantenimientos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar mantenimiento
export async function updateMaintenanceService(id_mantenimiento, maintenanceData) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({ where: { id_mantenimiento } });
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
export async function deleteMaintenanceService(id_mantenimiento) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({
      where: { id_mantenimiento },
      relations: ["inventoryItems"],
    });

    if (!maintenance) return [null, { type: "not_found", message: "Mantenimiento no encontrado" }];

    const revertResult = await revertirInventario(maintenance);
    if (!revertResult.success) {
      return [null, { type: "inventory_error", message: revertResult.message }];
    }

    await maintenanceRepository.remove(maintenance);
    return [maintenance, null];
  } catch (error) {
    console.error("Error al eliminar el mantenimiento:", error);
    if (error.code === "23503") {
      return [null, {
        type: "foreign_key_violation",
        message: `No se puede eliminar el mantenimiento con ID ${id_mantenimiento}, está referenciado en otra tabla.`,
        detail: error.detail,
        constraint: error.constraint,
      }];
    }
    return [null, { type: "server_error", message: "Error interno del servidor" }];
  }
}
