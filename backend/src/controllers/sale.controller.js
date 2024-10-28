"use strict";

import {
    createSaleService,
    deleteSaleService,
    getAllSalesService,
    getSaleByIdService,
    restarInventarioService,
    updateSaleService,
    verificarInventarioService,
} from "../services/sale.service.js";

export async function createSale(req, res) {
    try {
        // Validar entrada
        if (!req.body.inventoryItemId || !req.body.quantity || !req.body.totalPrice) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }
        // Verificar si hay suficiente inventario
        const [hayInventario, errorInventario] = await verificarInventarioService(
            req.body.inventoryItemId, 
            req.body.quantity
        );
        if (errorInventario || !hayInventario) {
            return res.status(400).json({ 
                error: "No hay suficiente inventario para completar la venta." 
            });
        }

        // Restar del inventario
        await restarInventarioService(req.body.inventoryItemId, req.body.quantity);

        const [sale, error] = await createSaleService(req.body);
        if (error) return res.status(400).json({ error });
        res.status(201).json(sale);
    } catch (error) {
        console.error("Error al crear la venta", error);
        return res.status(500).json({ error: "Error al crear la venta" });
    }
}

export async function getAllSales(req, res) {
    try {
        const [sales, error] = await getAllSalesService();
        if (error) return res.status(400).json({ error });
        res.status(200).json(sales);
    } catch (error) {
        console.error("Error al obtener las ventas", error);
        return res.status(500).json({ error: "Error al obtener las ventas" });
    }
}

export async function getSaleById(req, res) {
    try {
        const { id } = req.params;
        const [sale, error] = await getSaleByIdService(id);
        if (error) return res.status(404).json({ error });
        res.status(200).json(sale);
    } catch (error) {
        console.error("Error al obtener la venta", error);
        return res.status(500).json({ error: "Error al obtener la venta" });
    }
}

export async function updateSale(req, res) {
    try {
        const { id } = req.params;
        // Validar entrada
        if (!req.body.inventoryItemId || !req.body.quantity || !req.body.totalPrice) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }

        const [sale, error] = await updateSaleService(id, req.body);
        if (error) return res.status(404).json({ error });
        res.status(200).json(sale);
    } catch (error) {
        console.error("Error al actualizar la venta", error);
        return res.status(500).json({ error: "Error al actualizar la venta" });
    }
}

export async function deleteSale(req, res) {
    try {
        const { id } = req.params;
        const [sale, error] = await deleteSaleService(id);
        if (error) return res.status(404).json({ error });
        res.status(200).json({ message: "Venta eliminada exitosamente", sale });
    } catch (error) {
        console.error("Error al eliminar la venta", error);
        return res.status(500).json({ error: "Error al eliminar la venta" });
    }
}
