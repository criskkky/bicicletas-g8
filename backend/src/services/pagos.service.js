"use strict";

import { AppDataSource } from "../config/configDb.js";
import PagosEntity from "../entity/pagos.entity.js";

export async function getPagoService(id_pago) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const pago = await pagosRepository.findOne({ where: { id_pago } });
    if (!pago) return [null, "Pago no encontrado"];
    return [pago, null];
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllPagosService() {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const pagos = await pagosRepository.find();
    if (!pagos || pagos.length === 0) return [null, "No hay pagos registrados"];
    return [pagos, null];
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createPagoService(pagoData) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const newPago = pagosRepository.create(pagoData);
    await pagosRepository.save(newPago);
    return [newPago, null];
  } catch (error) {
    console.error("Error al crear el pago:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updatePagoService(id_pago, pagoData) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const pagosRepository = queryRunner.manager.getRepository(PagosEntity);
    const pago = await pagosRepository.findOne({ where: { id_pago } });
    if (!pago) {
      await queryRunner.rollbackTransaction();
      return [null, "Pago no encontrado"];
    }

    pagosRepository.merge(pago, pagoData);
    await pagosRepository.save(pago);

    await queryRunner.commitTransaction();
    return [pago, null];
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error al actualizar el pago:", error);
    return [null, "Error interno del servidor"];
  } finally {
    await queryRunner.release();
  }
}

export async function deletePagoService(id_pago) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const pago = await pagosRepository.findOne({ where: { id_pago } });
    if (!pago) return [null, "Pago no encontrado"];
    
    await pagosRepository.remove(pago);
    return [pago, null];
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    return [null, "Error interno del servidor"];
  }
}
