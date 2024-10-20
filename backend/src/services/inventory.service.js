import { AppDataSource } from "../config/configDb.js";
import Inventory from "../entity/inventory.entity.js";

export async function getInventoryItemService(id) {
  try {
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const item = await inventoryRepository.findOne({ where: { id } });
    if (!item) return [null, "Ítem no encontrado"];
    return [item, null];
  } catch (error) {
    console.error("Error al obtener el ítem del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllInventoryItemsService() {
  try {
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const items = await inventoryRepository.find();
    if (!items || items.length === 0) return [null, "No hay ítems en el inventario"];
    return [items, null];
  } catch (error) {
    console.error("Error al obtener los ítems del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createInventoryItemService(itemData) {
  try {
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const newItem = inventoryRepository.create(itemData);
    await inventoryRepository.save(newItem);
    return [newItem, null];
  } catch (error) {
    console.error("Error al crear el ítem del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateInventoryItemService(id, itemData) {
  try {
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const item = await inventoryRepository.findOne({ where: { id } });
    if (!item) return [null, "Ítem no encontrado"];
    
    await inventoryRepository.update({ id }, { ...itemData, updatedAt: new Date() });
    const updatedItem = await inventoryRepository.findOne({ where: { id } });
    return [updatedItem, null];
  } catch (error) {
    console.error("Error al actualizar el ítem del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteInventoryItemService(id) {
  try {
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const item = await inventoryRepository.findOne({ where: { id } });
    if (!item) return [null, "Ítem no encontrado"];
    
    await inventoryRepository.remove(item);
    return [item, null];
  } catch (error) {
    console.error("Error al eliminar el ítem del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}