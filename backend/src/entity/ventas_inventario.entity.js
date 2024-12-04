"use strict";
import { EntitySchema } from "typeorm";

const VentaInventarioSchema = new EntitySchema({
  name: "VentaInventario",
  tableName: "venta_inventario",
  columns: {
    id: {  // Cambiado para reflejar una clave primaria única y no compuesta
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
      joinColumn: { name: "id_venta" },
      onDelete: "CASCADE", // Si se elimina una venta, se eliminen todos los registros de venta_inventario asociados.
    },
    items: {
      target: "Inventario",
      type: "many-to-one",
      joinColumn: { name: "id_item" },
      onDelete: "SET NULL", // Esto hace que si se elimina un item, la venta no se elimine.
    },
  },
});

export default VentaInventarioSchema;
