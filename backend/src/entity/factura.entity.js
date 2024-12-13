"use strict";
import { EntitySchema } from "typeorm";

const FacturaSchema = new EntitySchema({
  name: "Factura",
  tableName: "factura",
  columns: {
    id_factura: {
      type: "int",
      primary: true,
      generated: true,  // id_factura se genera automáticamente
    },
    id_venta: {
      type: "int",
      nullable: false,
      unique: true,  // Aseguramos que id_venta sea único en la tabla factura
    },
    id_mantenimiento: {
      type: "int",
      nullable: true,
    },
    rut_trabajador: {
      type: "varchar",
      length: 12,
      nullable: false,
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
    venta: {
      target: "Venta",
      type: "many-to-one",
      joinColumn: { name: "id_venta", referencedColumnName: "id_venta" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    mantenimiento: {
      target: "Mantenimiento",
      type: "one-to-many",
      joinColumn: { name: "id_mantenimiento", referencedColumnName: "id_mantenimiento" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_FACTURA",
      columns: ["id_factura"],
      unique: true,
    },
  ],
});

export default FacturaSchema;
