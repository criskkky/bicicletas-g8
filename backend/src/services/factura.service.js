"use strict";

import { AppDataSource } from "../config/configDb.js";
import FacturaEntity from "../entity/factura.entity.js";

// Crear una nueva factura
export async function createFacturaService(facturaData) {
  try {
    const facturaRepository = AppDataSource.getRepository(FacturaEntity);

    // Crear la nueva factura
    const newFactura = facturaRepository.create({
      rut_cliente: facturaData.rut_cliente,
      rut_trabajador: facturaData.rut_trabajador, // Simplemente asignar el valor proporcionado
      fecha_factura: facturaData.fecha_factura,
      metodo_pago: facturaData.metodo_pago,
      total: facturaData.total,
      tipo_factura: facturaData.tipo_factura,
    });

    await facturaRepository.save(newFactura);

    return [newFactura, null];
  } catch (error) {
    console.error("Error al crear la factura:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener todas las facturas
export async function getAllFacturasService() {
  try {
    const facturaRepository = AppDataSource.getRepository(FacturaEntity);
    const facturas = await facturaRepository.find();
    if (facturas.length === 0) return [null, "No hay facturas registradas"];
    return [facturas, null];
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener una factura por ID
export async function getFacturaByIdService(id_factura) {
  try {
    const facturaRepository = AppDataSource.getRepository(FacturaEntity);
    const factura = await facturaRepository.findOne({ where: { id_factura } });
    if (!factura) return [null, "Factura no encontrada"];
    return [factura, null];
  } catch (error) {
    console.error("Error al obtener la factura:", error);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar una factura
export async function updateFacturaService(id_factura, facturaData) {
  try {
    const facturaRepository = AppDataSource.getRepository(FacturaEntity);
    const factura = await facturaRepository.findOne({ where: { id_factura } });
    if (!factura) {
      return [null, "Factura no encontrada"];
    }

    // Actualizar los campos proporcionados, incluido `rut_trabajador` si es parte del request
    facturaRepository.merge(factura, facturaData);
    await facturaRepository.save(factura);

    return [factura, null];
  } catch (error) {
    console.error("Error al actualizar la factura:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar una factura
export async function deleteFacturaService(id_factura) {
  try {
    const facturaRepository = AppDataSource.getRepository(FacturaEntity);
    const factura = await facturaRepository.findOne({ where: { id_factura } });
    if (!factura) {
      return [null, "Factura no encontrada"];
    }

    await facturaRepository.remove(factura);
    return [factura, null];
  } catch (error) {
    console.error("Error al eliminar la factura:", error);
    return [null, "Error interno del servidor"];
  }
}
