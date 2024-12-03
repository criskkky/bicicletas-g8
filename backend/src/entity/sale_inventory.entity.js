import { EntitySchema } from "typeorm";

const VentaInventarioSchema = new EntitySchema({
  name: "VentaInventario",
  tableName: "venta_inventario",
  columns: {
    id_venta: {
      type: "int",
      primary: true, // Clave primaria compuesta
    },
    id_item: {
      type: "int",
      primary: true, // Clave primaria compuesta
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
      target: "Sale",
      type: "many-to-one",
      joinColumn: { name: "id_venta" },
      onDelete: "CASCADE",
    },
    item: {
      target: "Inventory",
      type: "many-to-one",
      joinColumn: { name: "id_item" },
      onDelete: "CASCADE",
    },
  },
});

export default VentaInventarioSchema;
