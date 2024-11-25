import { EntitySchema } from "typeorm";

const OrderSchema = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    workerRUT: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    jobType: {
      type: "enum",
      enum: ["Mantenimiento", "Venta"],
      nullable: false,
    },
    jobID: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    hoursWorked: {
      type: "int",
      nullable: false,
      default: 0, // en horas
    },
    note: {
      type: "text",
      nullable: true, // Mensaje opcional
    },
    status: {
      type: "varchar",
      length: 20,
      default: "pendiente", // Puede ser pendiente, en proceso, completado
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP", // Registro para la creación
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP", // Última actualización
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },

  indices: [
    {
      name: "IDX_ORDER",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default OrderSchema;
