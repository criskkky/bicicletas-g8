"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdminOrTechnician } from "../middlewares/authorization.middleware.js";
import {
    createSale,
    deleteSale,
    getAllSales,
    getSale,
    updateSale
} from "../controllers/ventas.controller.js";

const router = Router();

router
.use(authenticateJwt)
.use(isAdminOrTechnician);


router.post("/", createSale);
router.get("/", getAllSales);
router.get("/:id", getSale);
router.patch("/:id", updateSale);
router.delete("/:id", deleteSale);

export default router;
