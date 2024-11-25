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

      if (response.error) {
        setError(response.error); // Maneja el error si hay uno
        return null;
      }

      return response; // Retorna la orden actualizada
    } catch (err) {
      setIsLoading(false);
      setError("Error al editar la orden: " + err.message); // Maneja los errores generados por el servicio
      return null;
    }
  };

  return { editOrder, isLoading, error };
};
export default useEditOrder;