import { useState } from 'react';
import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function Popup({ show, setShow, data, action }) {
    const isEdit = data && Object.keys(data).length > 0;
    const maintenanceData = isEdit ? data : {};

    const [items, setItems] = useState(maintenanceData.inventoryItems || [{ idItemUsed: "", quantityUsed: "" }]);

    const handleAddItem = () => {
        setItems([...items, { idItemUsed: "", quantityUsed: "" }]);
    };

    const handleRemoveItem = (index) => {
        if (items.length > 1) {
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);
        }
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleSubmit = (formData) => {
        // Transformar los datos del inventario
        const inventoryItems = items.map(item => ({
            inventory_id: item.idItemUsed,  // Cambio a `inventory_id`
            quantityUsed: parseInt(item.quantityUsed, 10),  // Asegúrate de que la cantidad sea un número
        }));
    
        // Crear el objeto con todos los datos
        const dataToSubmit = { 
            ...formData,  // Esto incluye description, technician, status, etc.
            inventoryItems,  // Esto incluye los items correctamente formateados
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
                            title={isEdit ? "Editar mantenimiento" : "Crear mantenimiento"}
                            fields={[
                                {
                                    label: "Descripción",
                                    name: "description",
                                    defaultValue: maintenanceData.description || "",
                                    placeholder: "Descripción del mantenimiento",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 10,
                                    maxLength: 150,
                                },
                                {
                                    label: "Técnico",
                                    name: "technician",
                                    defaultValue: maintenanceData.technician || "",
                                    placeholder: "Nombre del técnico",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 5,
                                    maxLength: 100,
                                },
                                {
                                    label: "Estado",
                                    name: "status",
                                    fieldType: "select",
                                    options: [
                                        { value: "pendiente", label: "Pendiente" },
                                        { value: "en_proceso", label: "En Proceso" },
                                        { value: "completado", label: "Completado" },
                                    ],
                                    required: true,
                                    defaultValue: maintenanceData.status || "pendiente",
                                },
                                {
                                    label: "Fecha",
                                    name: "date",
                                    defaultValue: maintenanceData.date || "",
                                    placeholder: "Fecha de mantenimiento",
                                    fieldType: "input",
                                    type: "date",
                                    required: true,
                                },
                                ...items.flatMap((item, index) => [ // Mapear los items para crear los campos
                                    {
                                        label: `ID de artículo usado ${index + 1}`,
                                        name: `idItemUsed-${index}`,
                                        defaultValue: item.idItemUsed || "0",
                                        placeholder: "ID del artículo usado",
                                        fieldType: "input",
                                        type: "number",
                                        required: true,
                                        onChange: (e) => handleItemChange(index, "idItemUsed", e.target.value),
                                    },
                                    {
                                        label: `Cantidad usada ${index + 1}`,
                                        name: `quantityUsed-${index}`,
                                        defaultValue: item.quantityUsed || "0",
                                        placeholder: "Cantidad de artículo usado",
                                        fieldType: "input",
                                        type: "number",
                                        required: true,
                                        onChange: (e) => handleItemChange(index, "quantityUsed", e.target.value),
                                    },
                                ]),
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar cambios" : "Crear mantenimiento"}
                            backgroundColor={"#fff"}
                        />
                        <div className="form">
                            <button type="button" onClick={handleAddItem}>Añadir otro artículo</button>
                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(items.length - 1)}
                                    style={{ marginTop: "10px" }}
                                >
                                    Quitar último artículo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
