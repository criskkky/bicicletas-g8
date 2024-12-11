import { useState, useEffect } from 'react';
import Form from './Form';
import '@styles/popup_1.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupInventory({ show, setShow, inventoryItem, action }) {
    const isEdit = inventoryItem && Object.keys(inventoryItem).length > 0;
    const [itemData, setItemData] = useState({});

    useEffect(() => {
        if (isEdit) {
            setItemData(inventoryItem);
        } else {
            setItemData({});
        }
    }, [inventoryItem, isEdit]);

    const handleSubmit = (formData) => {
        const dataToSubmit = { 
            ...formData,
            id_item: isEdit ? itemData.id_item : undefined,
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
                            title={isEdit ? "Editar artículo" : "Crear artículo"}
                            fields={[
                                {
                                    label: "Nombre",
                                    name: "nombre",
                                    defaultValue: itemData.nombre || "",
                                    placeholder: "Nombre del artículo",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Marca",
                                    name: "marca",
                                    defaultValue: itemData.marca || "",
                                    placeholder: "Marca del artículo",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Descripción",
                                    name: "descripcion",
                                    defaultValue: itemData.descripcion || "",
                                    placeholder: "Descripción del artículo",
                                    fieldType: "textarea",
                                    required: false,
                                    minLength: 10,
                                    maxLength: 150,
                                },
                                {
                                    label: "Precio",
                                    name: "precio",
                                    defaultValue: itemData.precio || "",
                                    placeholder: "Precio unitario",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                    min: 0,
                                },
                                {
                                    label: "Stock",
                                    name: "stock",
                                    defaultValue: itemData.stock || "",
                                    placeholder: "Cantidad en stock",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                    min: 0,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar cambios" : "Crear artículo"}
                            backgroundColor={"#fff"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
