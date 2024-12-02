import { EntitySchema } from "typeorm";

const VentaInventarioSchema = new EntitySchema({
  name: "VentaInventario",
  tableName: "venta_inventario",
  columns: {
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
      target: "Sale",
      type: "many-to-one",
      joinColumn: {
        name: "id_venta",
        referencedColumnName: "id_venta",
      },
    },
    item: {
      target: "Inventory",
      type: "many-to-one",
      joinColumn: {
        name: "id_item",
        referencedColumnName: "id_item",
      },
    },
  },
});

export default VentaInventarioSchema;
