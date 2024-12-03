import { EntitySchema } from "typeorm";

const SaleSchema = new EntitySchema({
  name: "Sale",
  tableName: "venta",
  columns: {
    id_venta: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_cliente: {
      type: "int",
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
    tipo_venta: {
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
    maintenances: {
      target: "Maintenance",
      type: "one-to-many",
      inverseSide: "usersRut", // Este alias debe coincidir con el campo en MaintenanceSchema
      cascade: false, // No queremos que eliminar un usuario elimine sus mantenimientos
    },
    pagos: {
      target: "Pagos",
      type: "one-to-many",
      inverseSide: "user", // Este alias debe coincidir con el campo en PagosSchema
      cascade: false, // No queremos que eliminar un usuario elimine sus pagos
    },
    orders: {
      target: "Order",
      type: "one-to-many",
      inverseSide: "user", // Este alias debe coincidir con el campo en OrderSchema
      cascade: false, // No eliminar las órdenes si se elimina el usuario
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
