"use strict";

import { AppDataSource } from "../config/configDb.js";
import FacturaEntity from "../entity/factura.entity.js";

export async function createFacturaService(facturaData) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const facturaRepository = queryRunner.manager.getRepository(FacturaEntity);
    const newFactura = facturaRepository.create(facturaData);
    await facturaRepository.save(newFactura);

    await queryRunner.commitTransaction();
    return [newFactura, null];
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error al crear la factura:", error);
    return [null, "Error interno del servidor"];
  } finally {
    await queryRunner.release();
  }
}

export async function getAllFacturasService() {
  const facturaRepository = AppDataSource.getRepository(FacturaEntity);
  try {
    const facturas = await facturaRepository.find();
    if (facturas.length === 0) return [null, "No hay facturas registradas"];
    return [facturas, null];
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getFacturaByIdService(id_factura) {
  const facturaRepository = AppDataSource.getRepository(FacturaEntity);
  try {
    const factura = await facturaRepository.findOne({ where: { id_factura } });
    if (!factura) return [null, "Factura no encontrada"];
    return [factura, null];
  } catch (error) {
    console.error("Error al obtener la factura:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateFacturaService(id_factura, facturaData) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const facturaRepository = queryRunner.manager.getRepository(FacturaEntity);
    const factura = await facturaRepository.findOne({ where: { id_factura } });
    if (!factura) {
      await queryRunner.rollbackTransaction();
      return [null, "Factura no encontrada"];
    }

    facturaRepository.merge(factura, facturaData);
    await facturaRepository.save(factura);

    await queryRunner.commitTransaction();
    return [factura, null];
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error al actualizar la factura:", error);
    return [null, "Error interno del servidor"];
  } finally {
    await queryRunner.release();
  }
}

export async function deleteFacturaService(id_factura) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const facturaRepository = queryRunner.manager.getRepository(FacturaEntity);
    const factura = await facturaRepository.findOne({ where: { id_factura } });
    if (!factura) {
      await queryRunner.rollbackTransaction();
      return [null, "Factura no encontrada"];
    }

    await facturaRepository.remove(factura);

    await queryRunner.commitTransaction();
    return [factura, null];
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error al eliminar la factura:", error);
    return [null, "Error interno del servidor"];
  } finally {
    await queryRunner.release();
  }
}
