import { useState } from "react";
import { createOrder } from "@services/order.service"; // Asegúrate de que la función createOrder esté correctamente exportada desde el servicio

export const useCreateOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNewOrder = async (orderData) => {
    setIsLoading(true);
    setError(null); // Resetea el error al intentar crear una nueva orden

    try {
      const response = await createOrder(orderData); // Llama al servicio para crear la orden
      setIsLoading(false);

      if (response.error) {
        setError(response.error); // Maneja el error si hay uno
        return null;
      }

      return response; // Retorna la respuesta de la creación de la orden
    } catch (err) {
      setIsLoading(false);
      setError("Error al crear la orden: " + err.message); // Maneja los errores generados por el servicio
      return null;
    }
  };

  return { createNewOrder, isLoading, error };
};
export default useCreateOrder;