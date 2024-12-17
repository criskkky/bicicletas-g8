"use strict";
import {
  createSaleService,
  deleteSaleService,
  getAllSalesService,
  getSaleService,
  updateSaleService,
} from "../services/ventas.service.js";

// Crear una venta
export async function createSale(req, res) {
  try {
    const { rut_cliente, rut_trabajador, fecha_venta, items, metodo_pago } = req.body;

    // Validación de campos obligatorios
    if (!rut_cliente || !rut_trabajador || !fecha_venta) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [sale, invoice, order, error] = await createSaleService({
      rut_cliente,
      rut_trabajador,
      fecha_venta,
      items,
      metodo_pago,
    });

    if (error) {
      console.error("Error al crear la venta:", error);
      if(error.message.includes("Inventario insuficiente")){
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor(crear)" });
    }

    res.status(201).json({ message: "Venta creada con éxito", sale, invoice, order });
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor(crear)" });
  }
}

// Obtener todas las ventas
export async function getAllSales(req, res) {
  try {
    const sales = await getAllSalesService();

    if (!sales || sales.length === 0) {
      return res.status(404).json({ error: "No se encontraron ventas" });
    }

    res.json(sales);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return res.status(500).json({ error: "Error interno del servidor(ver)" });
  }
}

// Obtener una venta específica
export async function getSale(req, res) {
  try {
    const { id } = req.params;

    const sale = await getSaleService(id);

    if (!sale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    res.json(sale);
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor(ver)" });
  }
}

// Actualizar una venta
export async function updateSale(req, res) {
  console.log("antes de try-catch");
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("Iniciando proceso de actualización de venta", { id, updateData });

    // Validación de campos obligatorios
    if (!updateData.rut_trabajador || !updateData.rut_cliente || !updateData.fecha_venta) {
      console.warn("Faltan campos obligatorios en la solicitud", { updateData });
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (!updateData.id_venta) {
      console.warn("El campo id_venta no está definido en la solicitud", { updateData });
      return res.status(400).json({ error: "El campo id_venta es obligatorio" });
    }

    console.log("Campos obligatorios validados correctamente");

    console.log("Llamando a updateSaleService con ID:", id, "y datos:", updateData);
    const result = await updateSaleService(id, updateData);
    console.log("Resultado de updateSaleService:", result);

    if (!Array.isArray(result) || result.length !== 4) {
      console.error("Respuesta inesperada de updateSaleService:", result);
      throw new Error("La respuesta del servicio no tiene el formato esperado");
    }

    const [updatedSale, updatedInvoice, updatedOrder, error] = result;

    if (error) {
      console.error("Error al actualizar la venta en el servicio", error);
      return res.status(500).json({ error: "Error interno del servidor(update)" });
    }

    if (!updatedSale) {
      console.warn("No se encontró una venta con el ID proporcionado", { id });
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    console.log("Venta actualizada con éxito", { updatedSale, updatedInvoice, updatedOrder });
    res.json({ message: "Venta actualizada con éxito", updatedSale, updatedInvoice, updatedOrder });
  } catch (error) {
    console.error("Error inesperado al procesar la actualización de la venta", error);
    return res.status(500).json({ error: "Error interno del servidor(update)" });
  }
}



// Eliminar una venta
export async function deleteSale(req, res) {
  try {
    const { id } = req.params;

    const { success, message } = await deleteSaleService(id);

    if (!success) {
      return res.status(404).json({ error: message });
    }

    res.json({ message: "Venta eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return res.status(500).json({ error: "Error interno del servidor(eliminar)" });
  }
}
