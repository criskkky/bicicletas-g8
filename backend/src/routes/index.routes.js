"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import saleRoutes from "./sale.routes.js";
import orderRoutes from "./order.routes.js";
import pagosRoutes from "./pagos.routes.js";
import maintenanceRoutes from "./maintenance.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/inventory", inventoryRoutes)
    .use("/sale", saleRoutes)
    .use("/orders", orderRoutes)
    .use("/pagos", pagosRoutes)
    .use("/maintenance", maintenanceRoutes)

export default router;