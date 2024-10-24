"use strict";

import { Router } from "express";
import {
    createSale,
    deleteSale,
    getAllSales,
    getSaleById,
    updateSale
} from "../controllers/sale.controller.js";

const router = Router();

router.post("/", createSale);
router.get("/", getAllSales);
router.get("/:id", getSaleById);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

export default router;
