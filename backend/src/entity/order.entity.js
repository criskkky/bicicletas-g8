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
    NameClient: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    problemDescription: {
      type: "text",
      nullable: false,
    },
    serviceDetails: {
      type: "text",
      nullable: true,
    },
    assignedTechnician: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    timeSpent: {
      type: "int",
      nullable: false,
      default: 0, // en minutos
    },
    usedProducts: {
      type: "json", 
      nullable: true,
    },
    status: {
      type: "varchar",
      length: 20,
      default: "pendiente", // Puede ser pendiente, en proceso, completado
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP", // resgistro para las horas
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP", //ultima actualizacion
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    
    usedProducts: {
      target: "inventory", 
      property: "id", 
      type: "many-to-many",
     
      joinTable: {
        name: "order_used_products", // Tabla intermedia
        joinColumn: {
          name: "orderId",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "productId",
          referencedColumnName: "id",
        },
      },
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


