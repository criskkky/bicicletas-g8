import { useState, useEffect } from 'react';
import Form from './Form';
import '@styles/popup_1.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupPayment({ show, setShow, data, action }) {
    const isEdit = data && Object.keys(data).length > 0;
    const [paymentData, setPaymentData] = useState({});

    useEffect(() => {
        if (isEdit) {
            setPaymentData(data);
        } else {
            setPaymentData({});
        }
    }, [data, isEdit]);

    const handleSubmit = (formData) => {
        const dataToSubmit = { 
            ...formData,
            id_pago: isEdit ? paymentData.id_pago : undefined,
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
                            title={isEdit ? "Editar pago" : "Crear pago"}
                            fields={[
                                {
                                    label: "Técnico (RUT)",
                                    name: "rut_trabajador",
                                    defaultValue: paymentData.rut_trabajador || "",
                                    placeholder: "11.111.111-1",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Fecha de Pago",
                                    name: "fecha_pago",
                                    defaultValue: paymentData.fecha_pago || "",
                                    placeholder: "Fecha del pago",
                                    fieldType: "input",
                                    type: "date",
                                    required: true,
                                },
                                {
                                    label: "Estado",
                                    name: "estado",
                                    defaultValue: paymentData.estado || "pendiente",
                                    placeholder: "Estado del pago",
                                    fieldType: "select",
                                    options: [
                                        { value: "pendiente", label: "Pendiente" },
                                        { value: "realizado", label: "Realizado" },
                                    ],
                                    required: true,
                                },
                                {
                                    label: "Método de Pago",
                                    name: "metodo_pago",
                                    defaultValue: paymentData.metodo_pago || "efectivo",
                                    placeholder: "Método de pago",
                                    fieldType: "select",
                                    options: [
                                        { value: "efectivo", label: "Efectivo" },
                                        { value: "tarjeta", label: "Tarjeta" },
                                        { value: "transferencia", label: "Transferencia" },
                                    ],
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar cambios" : "Crear pago"}
                            backgroundColor={"#fff"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
