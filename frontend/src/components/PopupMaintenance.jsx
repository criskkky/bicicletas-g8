import { useState } from 'react';
import Form from './Form';
import '@styles/popup_1.css';
import CloseIcon from '@assets/XIcon.svg';

export default function Popup({ show, setShow, data, action }) {
    const currentUser = JSON.parse(sessionStorage.getItem('usuario'));
    const isEdit = data && Object.keys(data).length > 0;
    const maintenanceData = isEdit ? data : {};

    const [items, setItems] = useState(maintenanceData.items || [{ id_item: "", cantidad: "" }]);

    const handleAddItem = () => {
        setItems([...items, { id_item: "", cantidad: "" }]);
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
        // Transformar los datos de los artículos
        const itemsToSubmit = items.map(item => ({
            id_item: item.id_item,  // Cambiado a `id_item`
            cantidad: parseInt(item.cantidad, 10),  // Asegura que sea un número
        }));

        // Crear el objeto completo
        const dataToSubmit = { 
            ...formData,  // Incluye descripción, fecha, técnico (RUT)
            items: itemsToSubmit,  // Incluye los artículos correctamente formateados
        };

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
                                    label: "Técnico (RUT)",
                                    name: "rut_trabajador",
                                    defaultValue: maintenanceData.rut_trabajador || currentUser?.rut || "",
                                    placeholder: "RUT del técnico",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Cliente (RUT)",
                                    name: "rut_cliente",
                                    defaultValue: maintenanceData.rut_cliente || "",
                                    placeholder: "RUT del cliente",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },                                
                                {
                                    label: "Descripción",
                                    name: "descripcion",
                                    defaultValue: maintenanceData.descripcion || "",
                                    placeholder: "Descripción del mantenimiento",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 10,
                                    maxLength: 150,
                                },
                                {
                                    label: "Fecha",
                                    name: "fecha_mantenimiento",
                                    defaultValue: maintenanceData.fecha_mantenimiento || "",
                                    placeholder: "Fecha del mantenimiento",
                                    fieldType: "input",
                                    type: "date",
                                    required: true,
                                },
                                ...items.flatMap((item, index) => [ // flatmap para aplanar el array y evitar arrays anidados
                                    {
                                        label: `ID de artículo usado ${index + 1}`,
                                        name: `id_item-${index}`,
                                        defaultValue: item.id_item || "",
                                        placeholder: "ID del artículo usado",
                                        fieldType: "input",
                                        type: "text",
                                        required: true,
                                        onChange: (e) => handleItemChange(index, "id_item", e.target.value),
                                    },
                                    {
                                        label: `Cantidad usada ${index + 1}`,
                                        name: `cantidad-${index}`,
                                        defaultValue: item.cantidad || "",
                                        placeholder: "Cantidad del artículo usado",
                                        fieldType: "input",
                                        type: "number",
                                        required: true,
                                        onChange: (e) => handleItemChange(index, "cantidad", e.target.value),
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
