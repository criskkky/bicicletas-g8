"use strict";

import { AppDataSource } from "../config/configDb.js";
import SaleEntity from "../entity/sale.entity.js";
import InventoryItem from "../entity/inventory.entity.js"; 


export async function createSaleService(saleData) {
    const saleRepository = AppDataSource.getRepository(SaleEntity);
    const inventoryCheck = await verificarInventarioService(saleData.inventoryItemId, saleData.quantity);
    
    if (!inventoryCheck[0]) {
        return [null, inventoryCheck[1]]; // Retorna error si el inventario es insuficiente
    }

    try {
        const sale = saleRepository.create(saleData);
        await saleRepository.save(sale);

        await restarInventarioService(saleData.inventoryItemId, saleData.quantity);

        return [sale, null];
    } catch (error) {
        console.error("Error al crear la venta:", error);
        return [null, "Error al crear la venta"];
    }
}

// Nueva función para verificar el inventario
export async function verificarInventarioService(inventoryItemId, quantity) {
    const inventoryRepository = AppDataSource.getRepository(InventoryItem);
    try {
        const item = await inventoryRepository.findOne(inventoryItemId);
        if (!item || item.quantity < quantity) {
            return [false, "Inventario insuficiente"];
        }
        return [true, null];
    } catch (error) {
        console.error("Error al verificar el inventario:", error);
        return [null, "Error al verificar el inventario"];
    }
}

// Nueva función para restar del inventario
export async function restarInventarioService(inventoryItemId, quantity) {
    const inventoryRepository = AppDataSource.getRepository(InventoryItem);
    try {
        const item = await inventoryRepository.findOne(inventoryItemId);
        if (!item) {
            return [null, "Artículo no encontrado"];
        }
        item.quantity -= quantity; // Restar la cantidad
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
        const sales = await saleRepository.find();
        return [sales, null];
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        return [null, "Error al obtener las ventas"];
    }
}

export async function getSaleByIdService(id) {
    const saleRepository = AppDataSource.getRepository(SaleEntity);
    try {
        const sale = await saleRepository.findOne(id);
        if (!sale) {
            return [null, "Venta no encontrada"];
        }
        return [sale, null];
    } catch (error) {
        console.error("Error al obtener la venta por ID:", error);
        return [null, "Error al obtener la venta"];
    }
}

export async function updateSaleService(id, saleData) {
    const saleRepository = AppDataSource.getRepository(SaleEntity);
    try {
        const sale = await saleRepository.findOne(id);
        if (!sale) {
            return [null, "Venta no encontrada"];
        }
        // Actualizar los campos de la venta
        Object.assign(sale, saleData);
        sale.updatedAt = new Date(); // Actualizar la fecha de modificación
        await saleRepository.save(sale);
        return [sale, null];
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        return [null, "Error al actualizar la venta"];
    }
}

export async function deleteSaleService(id) {
    const saleRepository = AppDataSource.getRepository(SaleEntity);
    try {
        const sale = await saleRepository.findOne(id);
        if (!sale) {
            return [null, "Venta no encontrada"];
        }
        await saleRepository.remove(sale);
        return [sale, null];
    } catch (error) {
        console.error("Error al eliminar la venta:", error);
        return [null, "Error al eliminar la venta"];
    }
}
