"use strict";
import { EntitySchema } from "typeorm";

const OrdenesSchema = new EntitySchema({
  name: "Orden",
  tableName: "ordenes",
  columns: {
    rut_trabajador: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    id_orden: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_factura: {
      type: "int",
      nullable: false,
    },
    id_mantenimiento: {
      type: "int",
      nullable: true,
    },
    id_venta: {
      type: "int",
      nullable: true,
    },
    fecha_orden: {
      type: "date",
      nullable: false,
    },
    tipo_orden: {
      type: "enum",
      enum: ["venta", "mantenimiento"],
      nullable: false,
    },
    total: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    estado_orden: {
      type: "enum",
      enum: ["pendiente", "en proceso", "completada"],
      nullable: false,
    },
    hora_inicio: {
      type: "timestamp",
      nullable: true,
    },
    hora_fin: {
      type: "timestamp",
      nullable: true,
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
    factura: {
      target: "Factura",
      type: "many-to-one",
      joinColumn: { name: "id_factura" },
      inverseSide: "ordenes",
    },
    mantenimiento: {
      target: "Mantenimiento",
      type: "many-to-one",
      joinColumn: { name: "id_mantenimiento" },
      inverseSide: "ordenes",
      nullable: true,
    },
    venta: {
      target: "Venta",
      type: "many-to-one",
      joinColumn: { name: "id_venta" },
      inverseSide: "ordenes",
      nullable: true,
    },
    pago: {
      target: "Pago",
      type: "many-to-one",
      joinColumn: { name: "id_pago" }, // Asegúrate de que exista `id_pago` en la tabla `ordenes`
      inverseSide: "ordenes",
      nullable: true,
    },
  },
  indices: [
    {
      name: "IDX_ORDEN",
      columns: ["id_orden"],
    },
  ],
});

export default OrdenesSchema;
