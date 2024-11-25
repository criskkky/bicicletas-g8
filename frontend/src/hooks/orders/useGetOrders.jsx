import { useState, useEffect } from "react";
import { getOrder } from "@services/order.service.js"; // Asegúrate de que la función getOrder esté correctamente exportada desde el servicio

export const useGetOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null); // Resetea el error al intentar obtener la orden

      try {
        const response = await getOrder(orderId); // Llama al servicio para obtener la orden
        setIsLoading(false);

        if (response.error) {
          setError(response.error); // Maneja el error si hay uno
          return;
        }

        setOrder(response); // Guarda la orden obtenida en el estado
      } catch (err) {
        setIsLoading(false);
        setError("Error al obtener la orden: " + err.message); // Maneja los errores generados por el servicio
      }
    };

    if (orderId) {
      fetchOrder(); // Llama a la función solo si el orderId está disponible
    }
  }, [orderId]); // Vuelve a ejecutar el hook si el orderId cambia

  return { order, isLoading, error };
};
export default useGetOrder;