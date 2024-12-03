"use strict";

import {
  createFacturaService,
  deleteFacturaService,
  getAllFacturasService,
  getFacturaByIdService,
  updateFacturaService,
} from "../services/factura.service.js";

export async function createFactura(req, res) {
  try {
    const { rut, rut_cliente, fecha_factura, metodo_pago, total, tipo_factura } = req.body;

    // Validar campos obligatorios
    if (!rut || !rut_cliente || !fecha_factura || !metodo_pago || total === undefined || !tipo_factura) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Crear la factura
    const [factura, error] = await createFacturaService({
      rut,
      rut_cliente,
      fecha_factura,
      metodo_pago,
      total,
      tipo_factura,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(201).json({ message: "Factura creada con éxito", factura });
  } catch (error) {
    console.error("Error al crear la factura:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllFacturas(req, res) {
  try {
    const [facturas, error] = await getAllFacturasService();
    if (error) {
      return res.status(404).json({ error: "No se encontraron facturas" });
    }
    res.status(200).json(facturas);
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    return res.status(500).json({ error: "Error al obtener las facturas" });
  }
}

export async function getFacturaById(req, res) {
  try {
    const { id } = req.params;
    const [factura, error] = await getFacturaByIdService(id);
    if (error) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.status(200).json(factura);
  } catch (error) {
    console.error("Error al obtener la factura:", error);
    return res.status(500).json({ error: "Error al obtener la factura" });
  }
}

export async function updateFactura(req, res) {
  try {
    const { id } = req.params;
    const { rut, rut_cliente, fecha_factura, metodo_pago, total, tipo_factura } = req.body;

    if (!rut && !rut_cliente && !fecha_factura && !metodo_pago && total === undefined && !tipo_factura) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [factura, error] = await updateFacturaService(id, {
      rut,
      rut_cliente,
      fecha_factura,
      metodo_pago,
      total,
      tipo_factura,
    });

    if (error) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    res.status(200).json(factura);
  } catch (error) {
    console.error("Error al actualizar la factura:", error);
    return res.status(500).json({ error: "Error interno al actualizar la factura" });
  }
}

export async function deleteFactura(req, res) {
  try {
    const { id } = req.params;
    const [factura, error] = await deleteFacturaService(id);
    if (error) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.status(200).json({ message: "Factura eliminada exitosamente", factura });
  } catch (error) {
    console.error("Error al eliminar la factura:", error);
    return res.status(500).json({ error: "Error interno al eliminar la factura" });
  }
}
