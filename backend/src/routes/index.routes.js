"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import inventoryRoutes from "./inventario.routes.js";
import saleRoutes from "./ventas.routes.js";
import orderRoutes from "./orden.routes.js";
import pagosRoutes from "./pagos.routes.js";
import facturasRoutes from "./facturas.routes.js";
import maintenanceRoutes from "./mantenimiento.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/inventory", inventoryRoutes)
    .use("/sale", saleRoutes)
    .use("/orders", orderRoutes)
    .use("/pagos", pagosRoutes)
    .use("/facturas", facturasRoutes)
    .use("/maintenance", maintenanceRoutes)

export default router;