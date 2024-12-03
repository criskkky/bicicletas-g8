"use strict";

import { AppDataSource } from "../config/configDb.js";
import SaleEntity from "../entity/ventas.entity.js";
import InvoiceEntity from "../entity/factura.entity.js";
import InventoryItem from "../entity/inventario.entity.js";

export async function createSaleService(saleData) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const inventoryCheck = await verificarInventarioService(queryRunner, saleData.id_item, saleData.cantidad);
    if (!inventoryCheck[0]) {
      await queryRunner.rollbackTransaction();
      return [null, inventoryCheck[1]];
    }

    // Crear la entidad de venta
    const saleRepository = queryRunner.manager.getRepository(SaleEntity);
    const sale = saleRepository.create(saleData);

    // Restar del inventario antes de guardar la venta
    await restarInventarioService(queryRunner, saleData.id_item, saleData.cantidad);
    
    // Crear factura asociada a la venta
    const invoice = queryRunner.manager.create(InvoiceEntity, {
      rut_cliente: saleData.rut_cliente, // Asume que saleData contiene rut_cliente
      total: saleData.total, // Asume que saleData contiene el total calculado
      fecha_factura: new Date(),
      metodo_pago: "pendiente", // o cualquier otro valor por defecto o proporcionado
      tipo_factura: "venta"
    });
    await queryRunner.manager.save(invoice);

    // Asociar la factura creada a la venta
    sale.id_factura = invoice.id_factura;
    await saleRepository.save(sale);

    await queryRunner.commitTransaction();
    return [sale, null];
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error al crear la venta:", error);
    return [null, "Error al crear la venta"];
  } finally {
    await queryRunner.release();
  }
}

export async function verificarInventarioService(queryRunner, id_item, cantidad) {
  const inventoryRepository = queryRunner.manager.getRepository(InventoryItem);
  const item = await inventoryRepository.findOne({ where: { id_item } });
  if (!item) {
    return [null, "Artículo no encontrado"];
  }
  if (item.stock < cantidad) {
    return [null, "Inventario insuficiente"];
  }
  return [true, null];
}

export async function restarInventarioService(queryRunner, id_item, cantidad) {
  const inventoryRepository = queryRunner.manager.getRepository(InventoryItem);
  const item = await inventoryRepository.findOne({ where: { id_item } });
  if (!item) {
    return [null, "Artículo no encontrado"];
  }
  item.stock -= cantidad;
  await inventoryRepository.save(item);
  return [item, null];
}

export async function getAllSalesService() {
  const saleRepository = AppDataSource.getRepository(SaleEntity);
  try {
    const sales = await saleRepository.find({
      relations: ["inventoryItems"],
    });
    return [sales, null];
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return [null, "Error al obtener las ventas"];
  }
}

export async function getSaleByIdService(id_venta) {
  const saleRepository = AppDataSource.getRepository(SaleEntity);
  try {
    const sale = await saleRepository.findOne({
      where: { id_venta },
      relations: ["inventoryItems"],
    });
    if (!sale) {
      return [null, "Venta no encontrada"];
    }
    return [sale, null];
  } catch (error) {
    console.error("Error al obtener la venta por ID:", error);
    return [null, "Error al obtener la venta"];
  }
}

export async function updateSaleService(id_venta, saleData) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const saleRepository = queryRunner.manager.getRepository(SaleEntity);
    const sale = await saleRepository.findOne({ where: { id_venta } });
    if (!sale) {
      await queryRunner.rollbackTransaction();
      return [null, "Venta no encontrada"];
    }

    await restarInventarioService(queryRunner, sale.id_item, -sale.cantidad);
    saleRepository.merge(sale, saleData);
    await saleRepository.save(sale);

    await restarInventarioService(queryRunner, saleData.id_item, saleData.cantidad);
    await queryRunner.commitTransaction();

    return [sale, null];
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error al actualizar la venta:", error);
    return [null, "Error al actualizar la venta"];
  } finally {
    await queryRunner.release();
  }
}

export async function deleteSaleService(id_venta) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const saleRepository = queryRunner.manager.getRepository(SaleEntity);
    const sale = await saleRepository.findOne({ where: { id_venta } });
    if (!sale) {
      await queryRunner.rollbackTransaction();
      return [null, "Venta no encontrada"];
    }

    await restarInventarioService(queryRunner, sale.id_item, -sale.cantidad);
    await saleRepository.remove(sale);
    await queryRunner.commitTransaction();
    return [sale, null];
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error al eliminar la venta:", error);
    return [null, "Error al eliminar la venta"];
  } finally {
    await queryRunner.release();
  }
}
