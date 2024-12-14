import { useState } from 'react';
import { updateSale } from '@services/ventas.service.js'; // Importar el servicio correspondiente
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatSalePostUpdate } from '@helpers/formatDataSales.js';

const useEditSale = (fetchSales, setSales) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Controla la visibilidad del popup
  const [dataSale, setDataSale] = useState({}); // Almacena los datos de la venta seleccionada para edición

  // Abre el popup de edición si hay una venta seleccionada
  const handleClickUpdate = () => {
    if (dataSale && dataSale.id_venta) {
      setIsPopupOpen(true);
    }
  };

  // Lógica para actualizar una venta
  const handleUpdate = async (updatedSaleData) => {
    if (updatedSaleData && updatedSaleData.id_venta) {
      try {
        console.log('Datos enviados para actualización:', updatedSaleData);

        const updatedSale = await updateSale(updatedSaleData.id_venta, updatedSaleData);

        console.log('Venta actualizada:', updatedSale);

        showSuccessAlert('¡Actualizado!', 'La venta ha sido actualizada correctamente.');
        setIsPopupOpen(false);

        const formattedSale = formatSalePostUpdate(updatedSale);

        // Actualizar el estado local con la venta editada
        setSales(prevSales => prevSales.map(sale => sale.id_venta === formattedSale.id_venta
          ? { ...formattedSale, items: updatedSale.items }
          : sale
        ));

        await fetchSales(); // Refrescar la lista de ventas desde el backend
        setDataSale({}); // Limpiar los datos de la venta seleccionada
      } catch (error) {
        console.error('Error al actualizar la venta:', error);
        showErrorAlert('Error', `Ocurrió un error al actualizar la venta: ${error.message}`);
      }
    } else {
      showErrorAlert('Error', 'No se puede actualizar: falta el ID de la venta.');
    }
  };

  return {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataSale,
    setDataSale,
  };
};

export default useEditSale;
