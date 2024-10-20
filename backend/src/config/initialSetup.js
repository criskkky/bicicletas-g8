"use strict";
import User from "../entity/user.entity.js";
import Inventory from "../entity/inventory.entity.js";
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
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21.151.897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
            rut: "20.630.735-8",
            email: "usuario2.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20.738.450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21.172.447-1",
          email: "usuario5.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

// Crear inventario de Taller de Bicicletas
async function createInv() {
  try {
    const invRepository = AppDataSource.getRepository(Inventory);

    const count = await invRepository.count();
    if (count > 0) return;

    await Promise.all([
      invRepository.save(
        invRepository.create({
          name: "Bicicleta de Montaña",
          type: "bicicleta",
          quantity: 10,
          price: 500000,
        }),
      ),
      invRepository.save(
        invRepository.create({
          name: "Manguera de Freno",
          type: "repuesto",
          quantity: 50,
          price: 5000,
        }),
      ),
      invRepository.save(
        invRepository.create({
          name: "Neumático 26",
          type: "repuesto",
          quantity: 30,
          price: 10000,
        }),
      ),
      invRepository.save(
        invRepository.create({
          name: "Neumático 29",
          type: "repuesto",
          quantity: 20,
          price: 15000,
        }),
      ),
      invRepository.save(
        invRepository.create({
          name: "Neumático 700",
          type: "repuesto",
          quantity: 20,
          price: 15000,
        }),
      ),
      invRepository.save(
        invRepository.create({
          name: "Cadena",
          type: "repuesto",
          quantity: 30,
          price: 10000,
        }),
      ),
    ]);
    console.log("* => Inventario creado exitosamente");
  } catch (error) {
    console.error("Error al crear inventario:", error);
  }
}

export { createUsers, createInv };