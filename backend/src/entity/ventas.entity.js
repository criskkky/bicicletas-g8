"use strict";
import { EntitySchema } from "typeorm";

const SaleSchema = new EntitySchema({
  name: "Venta",
  tableName: "venta",
  columns: {
    id_venta: {
      type: "int",
      primary: true,
      generated: true,  // Esto asegura que id_venta sea generado automáticamente.
    },
    id_factura: {
      type: "int",
      nullable: false,  // Ahora es una clave foránea, no generada aquí.
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
    fecha_venta: {
      type: "date",
      nullable: false,
    },
    total: {
      type: "decimal",
      precision: 10,
      scale: 2,
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
      inverseSide: "ordenes",
      onDelete: "RESTRICT",
    },
    items: {  
      target: "VentaInventario",
      type: "one-to-many",
      joinColumn: { name: "id_item", referencedColumnName: "id_item" },
      inverseSide: "venta",
      onDelete: "CASCADE",
    },
    invoice: {
      target: "Factura",
      type: "one-to-one",  
      joinColumn: { name: "id_factura", referencedColumnName: "id_venta" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_VENTA",
      columns: ["id_venta"],
      unique: true,
    },
  ],
});

export default SaleSchema;
