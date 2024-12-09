"use strict";

import {
    createPagoService,
    deletePagoService,
    getAllPagosService,
    getPagoService,
    updatePagoService,
} from "../services/pagos.service.js";

import { getUserService } from "../services/user.service.js";

export async function createPago(req, res) {
    try {
        const { idTecnico } = req.body;

        if (!idTecnico) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }

        const [tecnico, tecnicoError] = await getUserService({ id: idTecnico });
        if (tecnicoError) {
            return res.status(404).json({ error: "Técnico no encontrado" });
        }

        if (!tecnico.hoursWorked || !tecnico.hourlyRate) {
            return res.status(400).json({
                error: "Horas trabajadas o tarifa por hora no están definidas para este técnico",
            });
        }
        const monto = tecnico.hoursWorked * tecnico.hourlyRate;

        req.body.monto = monto;
        const [pago, error] = await createPagoService(req.body);

        if (error) {
            return res.status(400).json({ error });
        }

        res.status(201).json({ message: "Pago creado con éxito", pago });
    } catch (error) {
        console.error("Error al crear el pago", error);
        return res.status(500).json({ error: "Error interno al crear el pago" });
    }
}


export async function getAllPagos(req, res) {
    try {
        const [pagos, error] = await getAllPagosService();
        if (error) return res.status(400).json({ error });
        res.status(200).json(pagos);
    } catch (error) {
        console.error("Error al obtener los pagos", error);
        return res.status(500).json({ error: "Error al obtener los pagos" });
    }
}

export async function getPagoById(req, res) {
    try {
        const { id } = req.params;
        const [pago, error] = await getPagoService(id);
        if (error) return res.status(404).json({ error });
        res.status(200).json(pago);
    } catch (error) {
        console.error("Error al obtener el pago", error);
        return res.status(500).json({ error: "Error al obtener el pago" });
    }
}

export async function updatePago(req, res) {
    try {
        const { id } = req.params;
        const { idTecnico, monto } = req.body;
        if (!idTecnico || !monto) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }

        const [pago, error] = await updatePagoService(id, req.body);
        if (error) return res.status(400).json({ error });
        res.status(200).json(pago);
    } catch (error) {
        console.error("Error al actualizar el pago", error);
        return res.status(500).json({ error: "Error al actualizar el pago" });
    }
}

export async function deletePago(req, res) {
    try {
        const { id } = req.params;
        const [pago, error] = await deletePagoService(id);
        if (error) return res.status(400).json({ error });
        res.status(200).json(pago);
    } catch (error) {
        console.error("Error al eliminar el pago", error);
        return res.status(500).json({ error: "Error al eliminar el pago" });
    }
}
