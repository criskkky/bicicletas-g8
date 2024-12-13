import { useState, useEffect } from 'react';
import Form from './Form';
import '@styles/popup_1.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupInvoice({ show, setShow, data, action }) {
    const isEdit = data && Object.keys(data).length > 0;
    const [invoiceData, setInvoiceData] = useState({});

    useEffect(() => {
        if (isEdit) {
            setInvoiceData(data);
        } else {
            setInvoiceData({});
        }
    }, [data, isEdit]);

    const handleSubmit = (formData) => {
        const dataToSubmit = { 
            ...formData,
            id_factura: isEdit ? invoiceData.id_factura : undefined,
        };
    
        action(dataToSubmit);
        setShow(false);
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup" style={{ overflow: "auto" }}>
                        <button className="close" onClick={() => setShow(false)} aria-label="Cerrar">
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title={isEdit ? "Editar factura" : "Crear factura"}
                            fields={[
                                {
                                    label: "Técnico (RUT)",
                                    name: "rut_trabajador",
                                    defaultValue: invoiceData.rut_trabajador || "",
                                    placeholder: "RUT del técnico",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Cliente (RUT)",
                                    name: "rut_cliente",
                                    defaultValue: invoiceData.rut_cliente || "",
                                    placeholder: "RUT del cliente",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Método de pago",
                                    name: "metodo_pago",
                                    defaultValue: invoiceData.metodo_pago || "efectivo",
                                    placeholder: "Seleccione método de pago",
                                    fieldType: "select",
                                    options: [
                                        { value: "efectivo", label: "Efectivo" },
                                        { value: "tarjeta", label: "Tarjeta" },
                                        { value: "transferencia", label: "Transferencia" },
                                    ],
                                    required: true,
                                },
                                {
                                    label: "Fecha de la factura",
                                    name: "fecha_factura",
                                    defaultValue: invoiceData.fecha_factura || "",
                                    placeholder: "Fecha de emisión",
                                    fieldType: "input",
                                    type: "date",
                                    required: true,
                                },
                                {
                                    label: "Total",
                                    name: "total",
                                    defaultValue: invoiceData.total || "",
                                    placeholder: "Total de la factura",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar cambios" : "Crear factura"}
                            backgroundColor={"#fff"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
