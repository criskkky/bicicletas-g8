
import { useState, useEffect } from 'react';
import Form from './Form';
import '@styles/popup_1.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupOrderEdit({ show, setShow, data, action }) {
    const isEdit = data && Object.keys(data).length > 0;
    const [orderData, setOrderData] = useState({});

    useEffect(() => {
        if (isEdit) {
            setOrderData(data);
        } else {
            setOrderData({});
        }
    }, [data, isEdit]);

    const handleSubmit = (formData) => {
        const dataToSubmit = {
            ...formData,
            id_orden: orderData.id_orden,
        };

        console.log("Datos a enviar:", dataToSubmit);
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
                            title="Editar Orden"
                            fields={[
                                {
                                    label: "Fecha de Orden",
                                    name: "fecha_orden",
                                    defaultValue: orderData.fecha_orden || "",
                                    placeholder: "Fecha de la orden",
                                    fieldType: "input",
                                    type: "date",
                                    required: true,
                                },
                                {
                                    label: "Hora de Inicio",
                                    name: "hora_inicio",
                                    defaultValue: orderData.hora_inicio || "",
                                    placeholder: "Hora de inicio",
                                    fieldType: "input",
                                    type: "datetime-local",
                                    required: false,
                                },
                                {
                                    label: "Hora de Fin",
                                    name: "hora_fin",
                                    defaultValue: orderData.hora_fin || "",
                                    placeholder: "Hora de fin",
                                    fieldType: "input",
                                    type: "datetime-local",
                                    required: false,
                                },
                                {
                                    label: "Estado de la Orden",
                                    name: "estado_orden",
                                    defaultValue: orderData.estado_orden || "pendiente",
                                    placeholder: "Estado",
                                    fieldType: "select",
                                    options: [
                                        { value: "pendiente", label: "Pendiente" },
                                        { value: "en proceso", label: "En Proceso" },
                                        { value: "completada", label: "Completada" },
                                    ],
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText="Guardar cambios"
                            backgroundColor={"#fff"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
