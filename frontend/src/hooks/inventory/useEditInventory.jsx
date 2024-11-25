import { useState } from 'react';
import axios from 'axios';

const useEditInventory = (setInventory) => {
  const [dataInventory, setDataInventory] = useState({});

  const handleUpdate = async (updatedItem) => {
    try {
      const response = await axios.patch(`/api/inventory/edit/${updatedItem.id}`, updatedItem);
      setInventory(prevInventory =>
        prevInventory.map(item => (item.id === updatedItem.id ? response.data : item))
      );
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  return { handleUpdate, dataInventory, setDataInventory };
};

export default useEditInventory;
