import { useState } from "react";
import { deleteOrder } from "@services/order.service.js"; // Asegúrate de que la función deleteOrder esté correctamente exportada desde el servicio

export const useDeleteOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteOrderById = async (orderId) => {
    setIsLoading(true);
    setError(null); // Resetea el error al intentar eliminar una orden

    try {
      const response = await deleteOrder(orderId); // Llama al servicio para eliminar la orden
      setIsLoading(false);

      if (response.error) {
        setError(response.error); // Maneja el error si hay uno
        return false;
      }

      return true; // Si la orden fue eliminada correctamente, retorna true
    } catch (err) {
      setIsLoading(false);
      setError("Error al eliminar la orden: " + err.message); // Maneja los errores generados por el servicio
      return false;
    }
  };

  return { deleteOrderById, isLoading, error };
};

export default useDeleteOrder;