import { useState, useEffect } from 'react';
import { getPayments } from '@services/pagos.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPayments();

      if (!Array.isArray(response)) {
        throw new Error("La respuesta del servidor no tiene el formato esperado.");
      }

      setPayments(response);
    } catch (error) {
      console.error("Error al obtener los pagos: ", error.message);
      setError(error.message || "Error al obtener los pagos");
      showWarningAlert("Error", error.message || "No se pudieron obtener los pagos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return { payments, fetchPayments, loading, error };
};

export default useGetPayments;
