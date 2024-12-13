import { useState, useEffect } from 'react';
import Form from './Form';
import '@styles/popup_1.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupInventory({ show, setShow, data, action }) {
    const isEdit = data && Object.keys(data).length > 0;
    const [inventoryData, setInventoryData] = useState({});

    useEffect(() => {
        if (isEdit) {
            setInventoryData(data);
        } else {
            setInventoryData({
                nombre: "",
                marca: "",
                descripcion: "",
                precio: "",
                stock: "",
            });
        }
    }, [data, isEdit]);

    const handleSubmit = (formData) => {
        const dataToSubmit = {
            ...formData,
            id_item: isEdit ? inventoryData.id_item : undefined,
        };

        console.log('Datos a enviar:', dataToSubmit);
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
                            title={isEdit ? "Editar inventario" : "Agregar al inventario"}
                            fields={[
                                {
                                    label: "Nombre del producto",
                                    name: "nombre",
                                    defaultValue: inventoryData.nombre || "",
                                    placeholder: "Nombre del producto",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Marca",
                                    name: "marca",
                                    defaultValue: inventoryData.marca || "",
                                    placeholder: "Marca del producto",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Descripción",
                                    name: "descripcion",
                                    defaultValue: inventoryData.descripcion || "",
                                    placeholder: "Descripción del producto",
                                    fieldType: "textarea",
                                    required: false,
                                    minLength: 10,
                                    maxLength: 255,
                                },
                                {
                                    label: "Precio unitario",
                                    name: "precio",
                                    defaultValue: inventoryData.precio || "",
                                    placeholder: "Precio unitario",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                },
                                {
                                    label: "Cantidad en stock",
                                    name: "stock",
                                    defaultValue: inventoryData.stock || "",
                                    placeholder: "Cantidad disponible",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar cambios" : "Agregar producto"}
                            backgroundColor={"#fff"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
