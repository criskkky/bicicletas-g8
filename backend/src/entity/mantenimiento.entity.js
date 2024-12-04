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
      inverseSide: "mantenimientos", // En plural para indicar que un trabajador puede tener múltiples mantenimientos
      onDelete: "RESTRICT", // No se puede eliminar un trabajador si tiene mantenimientos asociados
    },
    items: {
      target: "MantenimientoInventario",
      type: "one-to-many",
      inverseSide: "mantenimiento",
      onDelete: "CASCADE", // Si se elimina un mantenimiento también todos los registros de MantenimientoInventario
    },
  },
});

export default MaintenanceSchema;
