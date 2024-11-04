"use strict";
import {
  createInventoryItemService,
  deleteInventoryItemService,
  getAllInventoryItemsService,
  getInventoryItemService,
  updateInventoryItemService,
} from "../services/inventory.service.js";

export async function getInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const [item, error] = await getInventoryItemService(id);
    if (error) {
      return res.status(404).json({ error: "Ítem no encontrado" });
    }
    return res.json(item);
  } catch (error) {
    console.error("Error al obtener el ítem del inventario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllInventoryItems(req, res) {
  try {
    const [items, error] = await getAllInventoryItemsService();
    if (error) {
      return res.status(404).json({ error: "No se encontraron ítems" });
    }
    return res.json(items);
  } catch (error) {
    console.error("Error al obtener los ítems del inventario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createInventoryItem(req, res) {
  try {
    const { name, quantity, price, type } = req.body;
    if (!name || !quantity || !price || !type) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [item, error] = await createInventoryItemService(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(201).json(item);
  } catch (error) {
    console.error("Error al crear el ítem del inventario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const { name, quantity, price, type } = req.body;
    if (!name && !quantity && !price && !type) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [item, error] = await updateInventoryItemService(id, req.body);
    if (error) {
      return res.status(404).json({ error: "Ítem no encontrado" });
    }

    return res.json(item);

  } catch (error) { // Error de servidor
    console.error("Error al actualizar el ítem del inventario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const [item, error] = await deleteInventoryItemService(id);
    
    if (error) {
      // Verificar el tipo de error y responder adecuadamente
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

    return res.json({ message: "Ítem eliminado exitosamente", item });
    
  } catch (error) {
    console.error("Error al eliminar el ítem del inventario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
