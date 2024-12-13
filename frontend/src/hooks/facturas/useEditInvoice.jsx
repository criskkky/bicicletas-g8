import { useState } from 'react';
import { updateInvoice } from '@services/facturas.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatInvoicePostUpdate } from '@helpers/formatDataInvoice.js';

const useEditInvoice = (fetchInvoices, setInvoices) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataInvoice, setDataInvoice] = useState({});

    const handleClickUpdate = () => {
        if (dataInvoice && dataInvoice.id_factura) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedInvoiceData) => {
        if (updatedInvoiceData && updatedInvoiceData.id_factura) {
            try {
                console.log('Datos a actualizar:', updatedInvoiceData);
                const updatedInvoice = await updateInvoice(updatedInvoiceData.id_factura, updatedInvoiceData);

                console.log('Factura actualizada:', updatedInvoice);

                showSuccessAlert('¡Actualizado!', 'La factura ha sido actualizada correctamente.');
                setIsPopupOpen(false);

                const formattedInvoice = formatInvoicePostUpdate(updatedInvoice);

                setInvoices(prevInvoices => prevInvoices.map(invoice => 
                    invoice.id_factura === formattedInvoice.id_factura
                        ? { ...formattedInvoice }
                        : invoice
                ));

                await fetchInvoices();
                setDataInvoice({});
            } catch (error) {
                console.error('Error al actualizar la factura:', error);
                showErrorAlert('Error', `Ocurrió un error al actualizar la factura: ${error.message}`);
            }
        } else {
            showErrorAlert('Error', 'No se puede actualizar: falta el ID de factura');
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataInvoice,
        setDataInvoice
    };
};

export default useEditInvoice;
