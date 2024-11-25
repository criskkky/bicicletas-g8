import { useState } from "react";
import { updateOrder } from "@services/order.service.js"; // Asegúrate de que la función updateOrder esté correctamente exportada desde el servicio

export const useEditOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editOrder = async (orderId, updatedData) => {
    setIsLoading(true);
    setError(null); // Resetea el error al intentar editar una orden

    try {
      const response = await updateOrder(orderId, updatedData); // Llama al servicio para actualizar la orden
      setIsLoading(false);

      if (response && response.error) {
        // Si la respuesta tiene un campo 'error', maneja el error
        setError(response.error);
        return null;
      }

      return response; // Retorna la orden actualizada
    } catch (err) {
      setIsLoading(false);
      // Mejorar el manejo de errores mostrando el mensaje completo
      setError(`Error al editar la orden: ${err.message || err}`); 
      return null;
    }
  };

  return { editOrder, isLoading, error };
};

export default useEditOrder;
