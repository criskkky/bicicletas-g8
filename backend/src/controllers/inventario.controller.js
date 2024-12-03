"use strict";
import {
  createInventoryItemService,
  deleteInventoryItemService,
  getAllInventoryItemsService,
  getInventoryItemService,
  updateInventoryItemService,
} from "../services/inventario.service.js";

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
    const { nombre, marca, descripcion, stock, precio } = req.body;
    if (!nombre || !marca || !descripcion || stock === undefined || precio === undefined) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Validaciones adicionales
    if (stock < 0) {
      return res.status(400).json({ error: "El stock no puede ser negativo" });
    }
    if (precio <= 0) {
      return res.status(400).json({ error: "El precio debe ser mayor que cero" });
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
    const { nombre, marca, descripcion, stock, precio } = req.body;
    if (!nombre && !marca && !descripcion && stock === undefined && precio === undefined) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [item, error] = await updateInventoryItemService(id, req.body);
    if (error) {
      return res.status(404).json({ error: "Ítem no encontrado" });
    }

    return res.json(item);

  } catch (error) {
    console.error("Error al actualizar el ítem del inventario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const [item, error] = await deleteInventoryItemService(id);
    
    if (error) {
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
