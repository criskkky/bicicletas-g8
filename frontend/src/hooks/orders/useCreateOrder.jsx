import { useState } from "react";
import { createOrder } from "@services/order.service.js"; 

export const useCreateOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (orderData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createOrder(orderData); 
      setIsLoading(false);

      if (response.error) {
        setError(response.error); 
        return null;
      }

      window.location.reload(); 
      return response; 
    } catch (err) {
      setIsLoading(false);
      setError("Error al crear la orden: " + err.message);
      return null;
    }
  };

  return { handleCreate, isLoading, error };
};
export default useCreateOrder;