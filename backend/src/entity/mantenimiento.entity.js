"use strict";
import { EntitySchema } from "typeorm";

const MaintenanceSchema = new EntitySchema({
  name: "Mantenimiento",
  tableName: "mantenimientos",
  columns: {
    rut_trabajador: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    id_mantenimiento: {
      type: "int",
      primary: true,
      generated: true,
      unique: true,
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
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "rut_trabajador", referencedColumnName: "rut" },
      inverseSide: "mantenimientos",
      onDelete: "RESTRICT",
    },
    items: {
      target: "MantenimientoInventario",
      type: "one-to-many",
      inverseSide: "mantenimiento",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    invoice: {
      target: "Factura",
      type: "many-to-one",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_MNT",
      columns: ["id_mantenimiento"],
    },
  ],
});

export default MaintenanceSchema;
