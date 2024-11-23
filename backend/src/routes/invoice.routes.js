"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoice,
  updateInvoice
} from "../controllers/invoice.controller.js";

const router = Router();

router.use(authenticateJwt);

router // http://localhost:5000/api/invoices
    .get("/", getAllInvoices)
    .get("/view/:id", getInvoice)
    .post("/add", createInvoice)
    .patch("/edit/:id", updateInvoice)
    .delete("/delete/:id", deleteInvoice);

export default router;