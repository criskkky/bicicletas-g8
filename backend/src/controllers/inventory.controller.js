"use strict";
import {
  getInventoryItemService,
  getAllInventoryItemsService,
  createInventoryItemService,
  updateInventoryItemService,
  deleteInventoryItemService
} from "../services/inventory.service.js";

export async function getInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const [item, error] = await getInventoryItemService(id);
    if (error) return res.status(404).json({ error });
    res.json(item);
  } catch (error) {
    console.error("Error al obtener el ítem del inventario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllInventoryItems(req, res) {
  try {
    const [items, error] = await getAllInventoryItemsService();
    if (error) return res.status(404).json({ error });
    res.json(items);
  } catch (error) {
    console.error("Error al obtener los ítems del inventario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createInventoryItem(req, res) {
  try {
    const [item, error] = await createInventoryItemService(req.body);
    if (error) return res.status(400).json({ error });
    res.status(201).json(item);
  } catch (error) {
    console.error("Error al crear el ítem del inventario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const [item, error] = await updateInventoryItemService(id, req.body);
    if (error) return res.status(404).json({ error });
    res.json(item);
  } catch (error) {
    console.error("Error al actualizar el ítem del inventario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const [item, error] = await deleteInventoryItemService(id);
    if (error) return res.status(404).json({ error });
    res.json({ message: "Ítem eliminado exitosamente", item });
  } catch (error) {
    console.error("Error al eliminar el ítem del inventario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}