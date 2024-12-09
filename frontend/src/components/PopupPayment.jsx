import { useState } from 'react';
import Form from './Form';
import '@styles/popup_1.css';
import CloseIcon from '@assets/XIcon.svg';

export default function Popup({ show, setShow, data, action }) {
    const isEdit = data && Object.keys(data).length > 0;
    const paymentData = isEdit ? data : {};

    const handleSubmit = (formData) => {
        // Crear el objeto con todos los datos
        const dataToSubmit = {
            ...formData,  // Esto incluye técnico, monto, etc.
        };

        console.log('Datos a enviar:', dataToSubmit);  // Verifica los datos antes de enviarlos

        action(dataToSubmit); // Envía los datos combinados al `action`
    };


    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup" style={{ overflow: "auto" }}>
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Close" />
                        </button>
                        <Form
                            title={isEdit ? "Editar pago" : "Crear pago"}
                            fields={[
                                {
                                    label: "Técnico",
                                    name: "idTecnico",  // Cambiado a 'idTecnico' para coincidir con la entidad
                                    defaultValue: paymentData.idTecnico || "",
                                    placeholder: "ID del técnico",
                                    fieldType: "input",
                                    type: "number",  // Cambiado a 'number' para que coincida con el tipo de dato
                                    required: true,
                                },
                                {
                                    label: "Monto",
                                    name: "monto",
                                    defaultValue: paymentData.monto || "",
                                    placeholder: "Monto del pago",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                    min: 1,
                                },
                                {
                                    label: "Fecha",
                                    name: "date",
                                    defaultValue: paymentData.date || "",
                                    placeholder: "Fecha del pago",
                                    fieldType: "input",
                                    type: "date",
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
