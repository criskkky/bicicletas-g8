"use strict";

import { AppDataSource } from "../config/configDb.js";
import InventoryItem from "../entity/inventario.entity.js";

export async function createInventoryItemService(itemData) {
  const inventoryRepository = AppDataSource.getRepository(InventoryItem);
  try {
    const newItem = inventoryRepository.create(itemData);
    await inventoryRepository.save(newItem);
    return [newItem, null];
  } catch (error) {
    console.error("Error al crear el ítem del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllInventoryItemsService() {
  const inventoryRepository = AppDataSource.getRepository(InventoryItem);
  try {
    const items = await inventoryRepository.find();
    if (items.length === 0) return [null, "No hay ítems en el inventario"];
    return [items, null];
  } catch (error) {
    console.error("Error al obtener los ítems del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getInventoryItemService(id_item) {
  const inventoryRepository = AppDataSource.getRepository(InventoryItem);
  try {
    const item = await inventoryRepository.findOne({ where: { id_item } });
    if (!item) return [null, "Ítem no encontrado"];
    return [item, null];
  } catch (error) {
    console.error("Error al obtener el ítem del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateInventoryItemService(id_item, itemData) {
  const inventoryRepository = AppDataSource.getRepository(InventoryItem);
  try {
    const item = await inventoryRepository.findOne({ where: { id_item } });
    if (!item) return [null, "Ítem no encontrado"];
    
    inventoryRepository.merge(item, itemData);
    await inventoryRepository.save(item);
    return [item, null];
  } catch (error) {
    console.error("Error al actualizar el ítem del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteInventoryItemService(id_item) {
  const inventoryRepository = AppDataSource.getRepository(InventoryItem);
  try {
    const item = await inventoryRepository.findOne({ where: { id_item } });
    if (!item) {
      return [null, "Ítem no encontrado"];
    }

    await inventoryRepository.remove(item);
    return [item, null];
  } catch (error) {
    console.error("Error al eliminar el ítem del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}
