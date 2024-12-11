"use strict";
import User from "../entity/user.entity.js";
// import Inventory from "../entity/inventario.entity.js";
// import Sale from "../entity/ventas.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Salazar Jara",
          rut: "21.308.770-3",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Admin Badmin Cadmin Dadmin",
          rut: "11.111.111-1",
          email: "user@admin.com",
          password: await encryptPassword("admin123"),
          rol: "administrador",
        })
      ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Tecnico Atecnico Btecnico Ctecnico",
            rut: "22.222.222-2",
            email: "user@tecnico.com",
            password: await encryptPassword("tecnico123"),
            rol: "tecnico",
          }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };