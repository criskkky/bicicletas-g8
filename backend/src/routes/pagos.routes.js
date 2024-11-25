"use strict";

import { Router } from "express";
import { isAdminOrTechnician } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createPago,
    deletePago,
    getAllPagos,
    getPagoById,
    updatePago
} from "../controllers/pagos.controller.js";

const router = Router();

router
.use(authenticateJwt)
.use(isAdminOrTechnician);


router // http://localhost:5000/api/pagos
    .get("/", getAllPagos)
    .get("/view/:id", getPagoById)
    .post("/add", createPago)
    // PATCH actualiza solo los campos que se envían. PUT actualiza todos los campos y causa nulos en los campos no enviados.
    .patch("/edit/:id", updatePago)
    .delete("/delete/:id", deletePago);

export default router;