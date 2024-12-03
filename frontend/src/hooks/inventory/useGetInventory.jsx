import { useState, useEffect } from 'react';
import { getInventory } from '@services/inventario.service.js'
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =await getInventory();
      console.log('Respuesta de hook', response);
      
      if (!response || response.length === 0) {
        showWarningAlert("¡Advertencia!", "No existen registros de inventario.");
        return;
      }

      const formatInventoryData = (data) => {
        return data.map((item, index) => {
          console.log(`Procesando item ${index}:`, item);

          return {
          id: item.id || "ID no disponible", 
          name: item.name || "Nombre no disponible", 
          type: item.type || "Tipo no disponible", 
          quantity: item.quantity || 0, 
          price: item.price ? parseFloat(item.price).toFixed(2) : "Precio no disponible", 
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Fecha no disponible", 
          updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "Fecha no disponible", 
          };
        });
      };

      const formattedData = formatInventoryData(response);
      console.log('Datos después de formatear:', formattedData);

      setInventory(formattedData);

    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Hubo un problema al obtener el inventario. Intenta nuevamente.');
      console.error('Detalles del error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    loading,
    error,
    fetchInventory,
  };
};

export default useGetInventory;
