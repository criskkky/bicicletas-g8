"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createInventoryItem,
  deleteInventoryItem,
  getAllInventoryItems,
  getInventoryItem,
  updateInventoryItem
} from "../controllers/inventory.controller.js";

const router = Router();

router.use(authenticateJwt);

router // http://localhost:5000/api/inventory
  .get("/", getAllInventoryItems)
  .get("/view/:id", getInventoryItem)
  .post("/add", createInventoryItem)
  // PATCH actualiza solo los campos que se envían. PUT actualiza todos los campos y causa nulos en los campos no enviados.
  .patch("/edit/:id", updateInventoryItem)
  .delete("/delete/:id", deleteInventoryItem);

export default router;