"use strict";

import {
  createPagoService,
  deletePagoService,
  getAllPagosService,
  getPagoService,
  updatePagoService,
} from "../services/pagos.service.js";

export async function createPago(req, res) {
  try {
    const { rut, id_orden, cantidad_ordenes_realizadas, fecha_pago, metodo_pago } = req.body;

    // Validar campos obligatorios
    if (!rut || !id_orden || cantidad_ordenes_realizadas <= 0 || !fecha_pago || !metodo_pago) {
      return res.status(400).json({ error: "Faltan campos requeridos o son inválidos" });
    }

    // Crear el pago
    const [pago, error] = await createPagoService({
      rut,
      id_orden,
      cantidad_ordenes_realizadas,
      fecha_pago,
      metodo_pago,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: "Pago creado con éxito", pago });
  } catch (error) {
    console.error("Error al crear el pago:", error);
    return res.status(500).json({ error: "Error interno al crear el pago" });
  }
}

export async function getAllPagos(req, res) {
  try {
    const [pagos, error] = await getAllPagosService();
    if (error) {
      return res.status(404).json({ error: "No se encontraron pagos" });
    }
    res.status(200).json(pagos);
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    return res.status(500).json({ error: "Error al obtener los pagos" });
  }
}

export async function getPagoById(req, res) {
  try {
    const { id } = req.params;
    const [pago, error] = await getPagoService(id);
    if (error) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    res.status(200).json(pago);
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    return res.status(500).json({ error: "Error al obtener el pago" });
  }
}

export async function updatePago(req, res) {
  try {
    const { id } = req.params;
    const { rut, id_orden, cantidad_ordenes_realizadas, fecha_pago, metodo_pago } = req.body;

    if (!rut && !id_orden && !cantidad_ordenes_realizadas && !fecha_pago && !metodo_pago) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [pago, error] = await updatePagoService(id, {
      rut,
      id_orden,
      cantidad_ordenes_realizadas,
      fecha_pago,
      metodo_pago,
    });

    if (error) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    res.status(200).json(pago);
  } catch (error) {
    console.error("Error al actualizar el pago:", error);
    return res.status(500).json({ error: "Error interno al actualizar el pago" });
  }
}

export async function deletePago(req, res) {
  try {
    const { id } = req.params;
    const [pago, error] = await deletePagoService(id);
    if (error) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    res.status(200).json({ message: "Pago eliminado exitosamente", pago });
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    return res.status(500).json({ error: "Error interno al eliminar el pago" });
  }
}
