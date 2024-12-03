"use strict";
import { EntitySchema } from "typeorm";

const FacturaSchema = new EntitySchema({
  name: "Factura",
  tableName: "factura",
  columns: {
    id_factura: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut_cliente: {
      type: "varchar",
      nullable: false,
    },
    fecha_factura: {
      type: "date",
      nullable: false,
    },
    metodo_pago: {
      type: "enum",
      enum: ["efectivo", "tarjeta", "transferencia"],
      nullable: false,
    },
    total: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    tipo_factura: {
      type: "enum",
      enum: ["venta", "mantenimiento"],
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
      type: "one-to-one",
      joinColumn: { name: "rut" },
      inverseSide: "facturas",
    },
  },
});

export default FacturaSchema;
