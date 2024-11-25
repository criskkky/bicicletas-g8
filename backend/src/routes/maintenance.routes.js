"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createMaintenance,
  deleteMaintenance,
  getAllMaintenance,
  getMaintenance,
  updateMaintenance
} from "../controllers/maintenance.controller.js";

const router = Router();

router.use(authenticateJwt);

router // http://localhost:5000/api/maintenance
  .get("/", getAllMaintenance)
  .get("/view/:id", getMaintenance)
  .post("/add", createMaintenance)
  .patch("/edit/:id", updateMaintenance)
  .delete("/delete/:id", deleteMaintenance);
  
export default router;