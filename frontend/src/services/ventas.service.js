import axios from './root.service.js';

// Función para obtener todas las ventas
export async function getSales() {
  try {
    const response = await axios.get('/sale/');
    if (!response || !response.data) {
      throw new Error("La respuesta de la API no tiene la estructura esperada.");
    }

    // Formatear datos si es necesario
    return response.data.map((sale) => ({
      id_venta: sale.id_venta,
      rut_trabajador: sale.rut_trabajador,
      rut_cliente: sale.rut_cliente,
      fecha_venta: sale.fecha_venta,
      total: sale.total,
      items: sale.items || [],
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    }));
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return { error: error.message || 'Error al obtener las ventas' };
  }
}

// Función para obtener una venta específica por su ID
export async function getSale(id_venta) {
  try {
    const { data } = await axios.get(`/sale/${id_venta}`);
    return {
      id_venta: data.id_venta,
      rut_trabajador: data.rut_trabajador,
      rut_cliente: data.rut_cliente,
      fecha_venta: data.fecha_venta,
      total: data.total,
      items: data.items || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return error.response?.data || { error: 'Error al obtener la venta' };
  }
}

// Función para crear una nueva venta
export async function createSale(saleData) {
  try {
    const response = await axios.post('/sale/', saleData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return error.response?.data || { error: 'Error al crear la venta' };
  }
}

// Función para actualizar una venta existente
export async function updateSale(id_venta, saleData) {
  try {
    const response = await axios.patch(`/sale/${id_venta}`, saleData);

    if (!response.data || !response.data.updatedSale) {
      throw new Error('La respuesta del servidor no tiene la estructura esperada');
    }

    const updatedSale = response.data.updatedSale;

    return {
      ...updatedSale,
      items: saleData.items,
    };
  } catch (error) {
    console.error('Error al actualizar la venta:', error.response?.data || error.message);
    throw error;
  }
}

// Función para eliminar una venta
export async function deleteSale(id_venta) {
  try {
    const response = await axios.delete(`/sale/${id_venta}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return error.response?.data || { error: 'Error al eliminar la venta' };
  }
}
