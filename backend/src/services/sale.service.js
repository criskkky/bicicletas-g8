"use strict";

import { AppDataSource } from "../config/configDb.js";
import SaleEntity from "../entity/sale.entity.js";
import InventoryItem from "../entity/inventory.entity.js";

export async function createSaleService(saleData) {
  const saleRepository = AppDataSource.getRepository(SaleEntity);

  const inventoryCheck = await verificarInventarioService(saleData.id_item, saleData.cantidad);
  if (!inventoryCheck[0]) {
    return [null, inventoryCheck[1]];
  }

  try {
    const sale = saleRepository.create(saleData);
    await saleRepository.save(sale);

    await restarInventarioService(saleData.id_item, saleData.cantidad);

    return [sale, null];
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return [null, "Error al crear la venta"];
  }
}

export async function verificarInventarioService(id_item, cantidad) {
  const inventoryRepository = AppDataSource.getRepository(InventoryItem);
  try {
    const item = await inventoryRepository.findOne({ where: { id_item } });
    if (!item) {
      return [null, "Artículo no encontrado"];
    }
    if (item.stock < cantidad) {
      return [null, "Inventario insuficiente"];
    }
    return [true, null];
  } catch (error) {
    console.error("Error al verificar el inventario:", error);
    return [null, "Error al verificar el inventario"];
  }
}

export async function restarInventarioService(id_item, cantidad) {
  const inventoryRepository = AppDataSource.getRepository(InventoryItem);
  try {
    const item = await inventoryRepository.findOne({ where: { id_item } });
    if (!item) {
      return [null, "Artículo no encontrado"];
    }
    item.stock -= cantidad;
    await inventoryRepository.save(item);
    return [item, null];
  } catch (error) {
    console.error("Error al restar del inventario:", error);
    return [null, "Error al restar del inventario"];
  }
}

export async function getAllSalesService() {
  const saleRepository = AppDataSource.getRepository(SaleEntity);
  try {
    const sales = await saleRepository.find({
      relations: ["inventoryItem"],
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
      relations: ["inventoryItem"],
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

export async function deleteSaleService(id_venta) {
  const saleRepository = AppDataSource.getRepository(SaleEntity);
  try {
    const sale = await saleRepository.findOne({ where: { id_venta } });
    if (!sale) {
      return [null, "Venta no encontrada"];
    }

    await restarInventarioService(sale.id_item, -sale.cantidad);
    await saleRepository.remove(sale);
    return [sale, null];
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return [null, "Error al eliminar la venta"];
  }
}
