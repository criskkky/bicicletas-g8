import { EntitySchema } from "typeorm";

const PagosSchema = new EntitySchema({
  name: "Pagos",
  tableName: "pagos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    idCliente: {
      type: "int",
      nullable: false,
    },
    idTecnico: {
      type: "int",
      nullable: false,
    },
    monto: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  // relations: {
  //   cliente: {
  //     target: "Cliente",
  //     type: "many-to-one",
  //     joinColumn: true,
  //     eager: true,
  //   },
  //   tecnico: {
  //     target: "Tecnico",
  //     type: "many-to-one",
  //     joinColumn: true,
  //     eager: true,
  //   },
  // },
  indices: [
    {
      name: "IDX_PAGOS",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default PagosSchema;