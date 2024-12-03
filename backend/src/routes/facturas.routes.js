"use strict";
import { Router } from "express";
import { isAdminOrTechnician } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createFactura,
  deleteFactura,
  getAllFacturas,
  getFacturaById,
  updateFactura
} from "../controllers/factura.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdminOrTechnician);

router // http://localhost:5000/api/facturas
  .get("/", getAllFacturas)
  .get("/view/:id", getFacturaById)
  .post("/add", createFactura)
  .patch("/edit/:id", updateFactura)
  .delete("/delete/:id", deleteFactura);

export default router;
