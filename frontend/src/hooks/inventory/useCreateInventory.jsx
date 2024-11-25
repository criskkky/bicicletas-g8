import { useState } from 'react';
import axios from 'axios';


const useCreateInventory = (setInventory) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (newItem) => {
    setLoading(true); 
    setError(null);

    try {
      const response = await axios.post('/api/inventory/add', newItem);
      if (response && response.data) {
        setInventory(prevInventory => [...prevInventory, response.data]);
      }
    } catch (err) {
      setError('Error al crear el inventario. Intenta nuevamente.');
      console.error('Error creating inventory item:', err);
    } finally {
      setLoading(false); 
    }
  };
  return { handleCreate, loading, error };
};

export default useCreateInventory;
