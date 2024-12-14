import { useState, useEffect } from 'react';
import Form from './Form';
import '@styles/popup_1.css';
import CloseIcon from '@assets/XIcon.svg';
import { isAdmin } from '@helpers/session.jsx';

export default function PopupSales({ show, setShow, data, action, inventory }) {
    const currentUser = JSON.parse(sessionStorage.getItem('usuario'));
    const isEdit = data && Object.keys(data).length > 0;
    const [saleData, setSaleData] = useState({});
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (isEdit) {
            setSaleData(data);
            setItems(Array.isArray(data.items) ? data.items.map(item => ({ ...item })) : []);
        } else {
            setSaleData({});
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

    const handleSubmit = (formData) => {
        const itemsToSubmit = Object.keys(formData)
            .filter(key => key.startsWith("id_item-") || key.startsWith("cantidad-"))
            .reduce((acc, key) => {
                const index = key.split('-')[1]; 
                const field = key.startsWith("id_item-") ? "id_item" : "cantidad";
                
                if (!acc[index]) {
                    acc[index] = {};
                }
                
                acc[index][field] = field === "cantidad" ? parseInt(formData[key], 10) : formData[key];
                return acc;
            }, [])
            .filter(item => item.id_item && item.cantidad); 

        const dataToSubmit = {
            ...formData,
            id_venta: isEdit ? saleData.id_venta : undefined,
            id_factura: isEdit ? saleData.id_venta : undefined,
            items: itemsToSubmit,
            total: 0,
        };
    
        Object.keys(dataToSubmit).forEach(key => {
            if (key.startsWith("id_item-") || key.startsWith("cantidad-")) {
                delete dataToSubmit[key];
            }
        });
    
        console.log("Datos a enviar:", dataToSubmit);
        action(dataToSubmit);
        setShow(false);
    }; 

    // const getItemNameById = (id) => {
    //     const item = inventory.find(item => item.id_item === id);
    //     return item ? item.nombre : 'Desconocido';
    // };
    
    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup" style={{ overflow: "auto" }}>
                        <button className="close" onClick={() => setShow(false)} aria-label="Cerrar">
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title={isEdit ? "Editar venta" : "Crear venta"}
                            fields={[
                                {
                                    label: "Técnico (RUT)",
                                    name: "rut_trabajador",
                                    defaultValue: saleData.rut_trabajador || currentUser?.rut || "",
                                    placeholder: "RUT del técnico",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    disabled: !isAdmin(currentUser?.rol),
                                },
                                {
                                    label: "Cliente (RUT)",
                                    name: "rut_cliente",
                                    defaultValue: saleData.rut_cliente || "",
                                    placeholder: "RUT del cliente",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },                                
                                {
                                    label: "Fecha de venta",
                                    name: "fecha_venta",
                                    defaultValue: saleData.fecha_venta || "",
                                    placeholder: "Fecha de la venta",
                                    fieldType: "input",
                                    type: "date",
                                    required: true,
                                },
                                ...items.flatMap((item, index) => [
                                    {
                                        label: `Artículo vendido ${index + 1}`,
                                        name: `id_item-${index}`,
                                        defaultValue: item.id_item || "",
                                        placeholder: "Selecciona un artículo",
                                        fieldType: "select",
                                        options: inventory.map(i => ({
                                            value: i.id_item,
                                            label:`${i.nombre} (${i.id_item})`,
                                        })),
                                        onChange: (e) => handleItemChange(index, "id_item", e.target.value),
                                    },
                                    {
                                        label: `Cantidad vendida ${index + 1}`,
                                        name: `cantidad-${index}`,
                                        defaultValue: item.cantidad || "",
                                        placeholder: "Cantidad del artículo vendido",
                                        fieldType: "input",
                                        type: "number",
                                        onChange: (e) => handleItemChange(index, "cantidad", e.target.value),
                                    },
                                ]),
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar cambios" : "Crear venta"}
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
