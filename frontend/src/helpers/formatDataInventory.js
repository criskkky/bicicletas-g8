import { format as formatTempo } from "@formkit/tempo";

export function formatDataInventory(item) {
    return {
        ...item,
        id_item: item.id_item,
        nombre: item.nombre,
        marca: item.marca,
        descripcion: item.descripcion,
        precio: parseFloat(item.precio).toFixed(2),
        stock: parseInt(item.stock, 10),
        createdAt: formatTempo(item.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(item.updatedAt, "DD-MM-YYYY HH:mm:ss")
    };
}

export function formatInventoryPostUpdate(item) {
    return {
        id_item: item.id_item,
        nombre: item.nombre,
        marca: item.marca,
        descripcion: item.descripcion,
        precio: parseFloat(item.precio).toFixed(2),
        stock: parseInt(item.stock, 10),
        createdAt: formatTempo(item.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(item.updatedAt, "DD-MM-YYYY HH:mm:ss")
    };
}
