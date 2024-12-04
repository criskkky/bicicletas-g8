"use strict";

import { AppDataSource } from "../config/configDb.js";
import PagosEntity from "../entity/pagos.entity.js";
import Order from "../entity/orden.entity.js";

// Servicio para crear un nuevo pago
export async function createPagoService(pagoData) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const orderRepository = AppDataSource.getRepository(Order);

    // Obtener órdenes completadas por el trabajador
    const completedOrders = await orderRepository.find({
      where: {
        rut: pagoData.rut,
        estado_orden: "completada",
      },
    });

    // Calcular horas trabajadas y cantidad de órdenes realizadas
    let totalHorasTrabajadas = 0;
    let cantidadOrdenesRealizadas = completedOrders.length;

    for (const order of completedOrders) {
      if (order.hora_inicio && order.hora_fin) {
        // Calcular la diferencia entre hora_inicio y hora_fin en horas
        const horasTrabajadas = (new Date(order.hora_fin) - new Date(order.hora_inicio)) / (1000 * 60 * 60);
        totalHorasTrabajadas += horasTrabajadas;
      }
    }

    // Calcular el monto basado en una tarifa fija
    const tarifaPorHora = 10; // Tarifa por hora, puede ser ajustada según la lógica del negocio
    const monto = totalHorasTrabajadas * tarifaPorHora;

    // Crear el nuevo pago
    const newPago = pagosRepository.create({
      rut: pagoData.rut,
      id_orden: pagoData.id_orden,
      cantidad_ordenes_realizadas: cantidadOrdenesRealizadas,
      horas_trabajadas: totalHorasTrabajadas,
      fecha_pago: pagoData.fecha_pago,
      metodo_pago: pagoData.metodo_pago,
      monto: monto,
      estado: pagoData.estado,
    });

    await pagosRepository.save(newPago);
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
    const pago = await pagosRepository.findOne({ where: { id_pago } });
    if (!pago) {
      return [null, "Pago no encontrado"];
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
    const pago = await pagosRepository.findOne({ where: { id_pago } });
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
    const pagos = await pagosRepository.find();
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
    const pago = await pagosRepository.findOne({ where: { id_pago } });
    if (!pago) return [null, "Pago no encontrado"];

    await pagosRepository.remove(pago);
    return [pago, null];
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    return [null, "Error interno del servidor"];
  }
}
