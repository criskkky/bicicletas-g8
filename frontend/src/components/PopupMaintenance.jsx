import { useState, useEffect } from 'react';
import Form from './Form';
import '@styles/popup_1.css';
import CloseIcon from '@assets/XIcon.svg';
import { isAdmin } from '@helpers/session.jsx';

export default function PopupMaintenance({ show, setShow, data, action }) {
    const currentUser = JSON.parse(sessionStorage.getItem('usuario'));
    const isEdit = data && Object.keys(data).length > 0;
    const [maintenanceData, setMaintenanceData] = useState({});
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (isEdit) {
            setMaintenanceData(data);
            setItems(Array.isArray(data.items) ? data.items.map(item => ({ ...item })) : []);
        } else {
            setMaintenanceData({});
            setItems([{ id_item: "", cantidad: "" }]);
        }
    }, [data, isEdit]);

    const handleAddItem = () => {
        setItems(prevItems => [...prevItems, { id_item: "", cantidad: "" }]);
    };

    const handleRemoveItem = (index) => {
        setItems(prevItems => {
            if (prevItems.length > 1) {
                return prevItems.filter((_, i) => i !== index);
            }
            return prevItems;
        });
    };

    const handleItemChange = (index, field, value) => {
        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = { ...updatedItems[index], [field]: value };
            return updatedItems;
        });
    };

    const handleSubmit = async (formData) => {
        try {
            Object.keys(formData).forEach(key => {
                if (key.startsWith('id_item-') || key.startsWith('cantidad-')) {
                    delete formData[key];
                }
            });
    
            const itemsToSubmit = items.filter(item => item.id_item && item.cantidad).map(item => ({
                id_item: parseInt(item.id_item, 10),
                cantidad: parseInt(item.cantidad, 10),
            }));
    
            const dataToSubmit = { 
                ...formData,
                id_mantenimiento: isEdit ? maintenanceData.id_mantenimiento : undefined,
                items: itemsToSubmit,
            };
    
            await action(dataToSubmit); // Llama a la acción proporcionada (ej. crear/editar)
            setShow(false);
        } catch (error) {
            console.error("Error al enviar el mantenimiento:", error);
            alert("Ocurrió un error al guardar los datos. Por favor, inténtelo de nuevo.");
        }
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
                                    disabled: !isAdmin(currentUser?.rol),
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
                                    required: false,
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
                                ...items.flatMap((item, index) => [
                                    {
                                        label: `ID de artículo usado ${index + 1}`,
                                        name: `id_item-${index}`,
                                        defaultValue: item.id_item || "",
                                        placeholder: "ID del artículo usado",
                                        fieldType: "input",
                                        type: "text",
                                        onChange: (e) => handleItemChange(index, "id_item", e.target.value),
                                    },
                                    {
                                        label: `Cantidad usada ${index + 1}`,
                                        name: `cantidad-${index}`,
                                        defaultValue: item.cantidad || "",
                                        placeholder: "Cantidad del artículo usado",
                                        fieldType: "input",
                                        type: "number",
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

