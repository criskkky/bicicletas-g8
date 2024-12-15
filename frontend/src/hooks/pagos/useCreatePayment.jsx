import { useState } from 'react';
import { createPayment } from '@services/pagos.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const useCreatePayment = (setPayments) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreatePayment = async (paymentData) => {
    // Validar los datos antes de enviarlos al servicio
    if (!paymentData || !paymentData.rut_trabajador || !paymentData.id_ordenes || !paymentData.fecha_pago || !paymentData.metodo_pago || !paymentData.estado) {
      setError("Datos incompletos. Por favor verifique que todos los campos requeridos estén presentes.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamada al servicio para crear el pago
      const response = await createPayment(paymentData);

      if (response && response.pago) {
        // Agregar el pago creado a la lista existente
        setPayments((prevState) => [...prevState, response.pago]);

        // Mostrar alerta de éxito
        showSuccessAlert('¡Éxito!', 'El pago ha sido creado correctamente.');
      } else {
        throw new Error('La respuesta del servidor no contiene los datos esperados.');
      }
    } catch (error) {
      console.error('Error al crear el pago:', error);
      showErrorAlert('Error', error.message || 'Ocurrió un error al crear el pago.');
    } finally {
      setLoading(false);
    }
  };

  return { handleCreatePayment, loading, error };
};

export default useCreatePayment;
