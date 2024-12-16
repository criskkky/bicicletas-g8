import { useState } from 'react';
import { updateSale } from '@services/ventas.service.js'; 
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatSalePostUpdate } from '@helpers/formatDataSales.js';

const useEditSale = (fetchSales, setSales) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [dataSale, setDataSale] = useState({}); 

  const handleClickUpdate = () => {
    if (dataSale && dataSale.id_venta) {
      setIsPopupOpen(true);
    }
  };

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

        await fetchSales(); 
        setDataSale({}); 
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
