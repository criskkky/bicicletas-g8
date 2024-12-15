"use strict";

import {
  createPagoService,
  deletePagoService,
  getAllPagosService,
  getPagoService,
  updatePagoService,
} from "../services/pagos.service.js";

// Controlador para crear un nuevo pago
export async function createPago(req, res) {
  try {
    const { rut_trabajador, id_ordenes, fecha_pago, metodo_pago, estado } = req.body;

    // Validar campos obligatorios
    if (
      !rut_trabajador 
      || !id_ordenes 
      || !Array.isArray(id_ordenes) 
      || id_ordenes.length === 0 
      || !fecha_pago 
      || !metodo_pago 
      || !estado
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos o son inválidos" });
    }

    const [pago, error] = await createPagoService({
      rut_trabajador,
      id_ordenes,
      fecha_pago,
      metodo_pago,
      estado,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(201).json({ message: "Pago creado con éxito", pago });
  } catch (error) {
    console.error("Error al crear el pago:", error);
    return res.status(500).json({ error: "Error interno al crear el pago" });
  }
}

// Controlador para actualizar un pago
export async function updatePago(req, res) {
  try {
    const { id } = req.params;
    const { rut_trabajador, id_ordenes, fecha_pago, metodo_pago, estado } = req.body;

    // Validar campos para actualizar
    if (!rut_trabajador && (!id_ordenes || !Array.isArray(id_ordenes)) && !fecha_pago && !metodo_pago && !estado) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [pago, error] = await updatePagoService(id, {
      rut_trabajador,
      id_ordenes,
      fecha_pago,
      metodo_pago,
      estado,
    });

    if (error) {
      return res.status(404).json({ error });
    }

    res.status(200).json({ message: "Pago actualizado con éxito", pago });
  } catch (error) {
    console.error("Error al actualizar el pago:", error);
    return res.status(500).json({ error: "Error interno al actualizar el pago" });
  }
}

// Controlador para obtener un pago por ID
export async function getPagoById(req, res) {
  try {
    const { id } = req.params;
    const [pago, error] = await getPagoService(id);

    if (error) {
      return res.status(404).json({ error });
    }

    res.status(200).json(pago);
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    return res.status(500).json({ error: "Error interno al obtener el pago" });
  }
}

// Controlador para obtener todos los pagos
export async function getAllPagos(req, res) {
  try {
    const [pagos, error] = await getAllPagosService();

    if (error) {
      return res.status(404).json({ error });
    }

    res.status(200).json(pagos);
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    return res.status(500).json({ error: "Error interno al obtener los pagos" });
  }
}

// Controlador para eliminar un pago
export async function deletePago(req, res) {
  try {
    const { id } = req.params;
    const [pago, error] = await deletePagoService(id);

    if (error) {
      return res.status(404).json({ error });
    }

    res.status(200).json({ message: "Pago eliminado con éxito", pago });
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    return res.status(500).json({ error: "Error interno al eliminar el pago" });
  }
}
