import { useState } from "react";
import { deleteOrder } from "@services/order.service.js"; 

export const useDeleteOrder = (fetchOrders, setDataOrder) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteOrderById = async (orderId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteOrder(orderId);
      setIsLoading(false);

      if (response.error) {
        setError(response.error);
        return false;
      }

      
      fetchOrders();
      setDataOrder({ id: null }); 

      return true; 
    } catch (err) {
      setIsLoading(false);
      setError("Error al eliminar la orden: " + err.message); 
      return false;
    }
  };

  return { deleteOrderById, isLoading, error };
};

export default useDeleteOrder;
