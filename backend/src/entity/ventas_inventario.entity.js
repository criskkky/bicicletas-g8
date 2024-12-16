"use strict";
import { EntitySchema } from "typeorm";

const VentaInventarioSchema = new EntitySchema({
  name: "VentaInventario",
  tableName: "venta_inventario",
  columns: {
    id: {  
      type: "int",
      primary: true,
      generated: true,
    },
    id_venta: {
      type: "int",
      nullable: false,
    },
    id_item: {
      type: "int",
      nullable: false,
    },
    cantidad: {
      type: "int",
      nullable: false,
    },
    precio_costo: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
  },
  relations: {
    venta: {
      target: "Venta",
      type: "many-to-one",
      joinColumn: { name: "id_venta", referencedColumnName: "id_venta" },
      onDelete: "CASCADE", // Si se elimina una venta, se eliminen todos los registros de venta_inventario asociados.
      onUpdate: "CASCADE", // Si se actualiza una venta, se actualicen todos los registros de venta_inventario
    },
    items: {
      target: "Inventario",
      type: "many-to-one",
      joinColumn: { name: "id_item", referencedColumnName: "id_item" },
      onDelete: "SET NULL", // Esto hace que si se elimina un item, la venta no se elimine.
      onUpdate: "CASCADE", // Si se actualiza un item, se actualicen todos los registros de venta_inventario
    },
  },
  indices: [
    {
      name: "IDX_VNTINV",
      columns: ["id"],
    },
  ],
});

export default VentaInventarioSchema;
