"use strict";

import { AppDataSource } from "../config/configDb.js";
import PagosEntity from "../entity/pagos.entity.js";
import Order from "../entity/orden.entity.js";
import { In } from "typeorm";

// Servicio para crear un nuevo pago
export async function createPagoService(pagoData) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const orderRepository = AppDataSource.getRepository(Order);

    // Obtener las órdenes por sus IDs usando `In` para múltiples valores
    const orders = await orderRepository.find({
      where: {
        id_orden: In(pagoData.id_ordenes),
      },
    });

    if (orders.length === 0) {
      return [null, "No se encontraron órdenes para los IDs proporcionados"];
    }

    // Calcular horas trabajadas y cantidad de órdenes realizadas
    let totalHorasTrabajadas = 0;
    let cantidadOrdenesRealizadas = orders.length;

    for (const order of orders) {
      if (order.hora_inicio && order.hora_fin) {
        const horasTrabajadas = (new Date(order.hora_fin) - new Date(order.hora_inicio)) / (1000 * 60 * 60);
        totalHorasTrabajadas += horasTrabajadas;
      }
    }

    // Calcular el monto basado en una tarifa fija
    const tarifaPorHora = 10;
    const monto = totalHorasTrabajadas * tarifaPorHora;

    // Crear el nuevo pago
    const newPago = pagosRepository.create({
      rut_trabajador: pagoData.rut_trabajador,
      cantidad_ordenes_realizadas: cantidadOrdenesRealizadas,
      horas_trabajadas: totalHorasTrabajadas,
      fecha_pago: pagoData.fecha_pago,
      metodo_pago: pagoData.metodo_pago,
      monto: monto,
      estado: pagoData.estado,
    });

    // Guardar el pago
    await pagosRepository.save(newPago);

    // Actualizar cada orden con el id del pago creado
    for (const order of orders) {
      order.pago = newPago;
      await orderRepository.save(order);
    }

    return [newPago, null];
  } catch (error) {
    console.error("Error al crear el pago:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para actualizar un pago
export async function updatePagoService(id_pago, pagoData) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const orderRepository = AppDataSource.getRepository(Order);
    const pago = await pagosRepository.findOne({ where: { id_pago }, relations: ["ordenes"] });
    if (!pago) {
      return [null, "Pago no encontrado"];
    }

    if (pagoData.id_ordenes) {
      const orders = await orderRepository.findBy({
        id: In(pagoData.id_ordenes)
      });      
      
      if (orders.length === 0) {
        return [null, "No se encontraron órdenes para los IDs proporcionados"];
      }

      // Desasociar las órdenes previas
      for (const order of pago.ordenes) {
        order.pago = null;
        await orderRepository.save(order);
      }

      // Asociar las nuevas órdenes al pago
      for (const order of orders) {
        order.pago = pago;
        await orderRepository.save(order);
      }
    }

    pagosRepository.merge(pago, pagoData);
    await pagosRepository.save(pago);

    return [pago, null];
  } catch (error) {
    console.error("Error al actualizar el pago:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener un pago por ID
export async function getPagoService(id_pago) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const pago = await pagosRepository.findOne({ where: { id_pago }, relations: ["ordenes"] });
    if (!pago) return [null, "Pago no encontrado"];
    return [pago, null];
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener todos los pagos
export async function getAllPagosService() {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const pagos = await pagosRepository.find({ relations: ["ordenes"] });
    if (!pagos || pagos.length === 0) return [null, "No hay pagos registrados"];
    return [pagos, null];
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para eliminar un pago
export async function deletePagoService(id_pago) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const pago = await pagosRepository.findOne({ where: { id_pago }, relations: ["ordenes"] });
    if (!pago) return [null, "Pago no encontrado"];

    // Desasociar las órdenes antes de eliminar el pago
    for (const order of pago.ordenes) {
      order.pago = null;
      await AppDataSource.getRepository(Order).save(order);
    }

    await pagosRepository.remove(pago);
    return [pago, null];
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    return [null, "Error interno del servidor"];
  }
}
