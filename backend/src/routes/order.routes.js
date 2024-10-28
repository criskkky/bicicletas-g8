"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrder,
    updateOrder
    } from "../controllers/order.controller.js";

const router = Router();

router.use(authenticateJwt);

router // http://localhost:5000/api/orders
    .get("/", getAllOrders)
    .get("/view/:id", getOrder)
    .post("/add", createOrder)
    .patch("/edit/:id", updateOrder)
    .delete("/delete/:id", deleteOrder);

export default router;