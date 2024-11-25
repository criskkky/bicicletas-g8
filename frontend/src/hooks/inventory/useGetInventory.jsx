import { useState, useEffect } from 'react';
import axios from 'axios';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/inventory');
      
      if (!response.data || response.data.length === 0) {
        showWarningAlert("¡Advertencia!", "No existen registros de inventario.");
        return;
      }

      const formatInventoryData = (data) => {
        return data.map(item => ({
          id: item.id || "ID no disponible", 
          name: item.name || "Nombre no disponible", 
          type: item.type || "Tipo no disponible", 
          quantity: item.quantity || 0, 
          price: item.price ? parseFloat(item.price).toFixed(2) : "Precio no disponible", // Formateamos el precio a dos decimales
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Fecha no disponible", // Formateamos la fecha
          updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "Fecha no disponible", // Formateamos la fecha
        }));
      };

      setInventory(formatInventoryData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Hubo un problema al obtener el inventario. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    fetchInventory,
    setInventory,
    loading,
    error,
  };
};

export default useGetInventory;
