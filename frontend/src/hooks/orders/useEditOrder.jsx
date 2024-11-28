import { useState } from "react";
import { updateOrder } from "@services/order.service.js"; 

export const useEditOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editOrder = async (orderId, updatedData) => {
    setIsLoading(true);
    setError(null); 

    try {
      const response = await updateOrder(orderId, updatedData); 
      setIsLoading(false);

      if (response && response.error) {
        
        setError(response.error);
        return null;
      }

      return response; 
    } catch (err) {
      setIsLoading(false);
      
      setError(`Error al editar la orden: ${err.message || err}`); 
      return null;
    }
  };

  return { editOrder, isLoading, error };
};

export default useEditOrder;
