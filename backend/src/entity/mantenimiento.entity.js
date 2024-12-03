"use strict";
import { EntitySchema } from "typeorm";

const MaintenanceSchema = new EntitySchema({
  name: "Mantenimiento",
  tableName: "mantenimiento",
  columns: {
    id_mantenimiento: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut_cliente: {
      type: "varchar",
      nullable: false,
    },
    fecha_mantenimiento: {
      type: "date",
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    inventoryItems: {
      target: "MantenimientoInventario",
      type: "one-to-many",
      inverseSide: "mantenimiento",
    },
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "rut" },
      inverseSide: "maintenances",
    },
  },
});

export default MaintenanceSchema;
