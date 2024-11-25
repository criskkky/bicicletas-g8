import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import { useState } from 'react';

export default function PopupOrder({ show, setShow, data, action }) {
    // Determinar si es edición o creación basándonos en la existencia de datos
    const isEdit = data && Object.keys(data).length > 0;
    const orderData = isEdit ? data : {};

    // Estado para los productos usados
    const [usedProducts, setUsedProducts] = useState(orderData.usedProducts || [{ productName: '', quantity: 0 }]);

    const handleSubmit = (formData) => {
        // Asegurarse de incluir los productos correctamente al enviar los datos
        formData.usedProducts = usedProducts;  // Incluye los productos dinámicos
        action(formData); // Llama a la acción (crear o editar)
        setShow(false); // Cierra el popup después de guardar
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...usedProducts];
        updatedProducts[index][field] = value;
        setUsedProducts(updatedProducts);
    };

    const handleAddProduct = () => {
        setUsedProducts([...usedProducts, { productName: '', quantity: 0 }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = usedProducts.filter((_, i) => i !== index);
        setUsedProducts(updatedProducts);
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title={isEdit ? "Editar Orden" : "Nueva Orden"} // Dinámico
                            fields={[
                                {
                                    label: "Nombre del Cliente",
                                    name: "NameClient",
                                    defaultValue: orderData.NameClient || "",
                                    placeholder: "Nombre del cliente",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 3,
                                    maxLength: 100,
                                },
                                {
                                    label: "Descripción del Problema",
                                    name: "problemDescription",
                                    defaultValue: orderData.problemDescription || "",
                                    placeholder: "Descripción del problema",
                                    fieldType: "textarea",
                                    required: true,
                                    minLength: 10,
                                    maxLength: 300,
                                },
                                {
                                    label: "Tiempo Gastado (Horas)",
                                    name: "timeSpent",
                                    defaultValue: orderData.timeSpent || 0,
                                    placeholder: "Horas dedicadas",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                    min: 0,
                                },
                                {
                                    label: "Estado",
                                    name: "status",
                                    fieldType: "select",
                                    options: [
                                        { value: "Pendiente", label: "Pendiente" },
                                        { value: "En Proceso", label: "En Proceso" },
                                        { value: "Completado", label: "Completado" },
                                    ],
                                    required: true,
                                    defaultValue: orderData.status || "Pendiente",
                                },
                                {
                                    label: "Detalles del Servicio",
                                    name: "serviceDetails",
                                    defaultValue: orderData.serviceDetails || "",
                                    placeholder: "Detalles del servicio solicitado",
                                    fieldType: "input",
                                    type: "text",
                                    required: false,
                                    maxLength: 200,
                                },
                                {
                                    label: "Técnico Asignado",
                                    name: "assignedTechnician",
                                    defaultValue: orderData.assignedTechnician || "",
                                    placeholder: "Nombre del técnico",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 3,
                                    maxLength: 100,
                                },
                                // Mostrar campos dinámicos para productos usados
                                ...usedProducts.map((product, index) => ({
                                    label: `Producto ${index + 1} - Nombre`,
                                    name: `usedProducts[${index}].productName`,
                                    defaultValue: product.productName || "",
                                    placeholder: "Nombre del producto",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    onChange: (e) => handleProductChange(index, 'productName', e.target.value),
                                })),
                                ...usedProducts.map((product, index) => ({
                                    label: `Producto ${index + 1} - Cantidad`,
                                    name: `usedProducts[${index}].quantity`,
                                    defaultValue: product.quantity || 0,
                                    placeholder: "Cantidad de producto usado",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                    onChange: (e) => handleProductChange(index, 'quantity', e.target.value),
                                }))
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar cambios" : "Crear Orden"} // Dinámico
                            backgroundColor={"#fff"}
                        />
                        {/* Botón para agregar un producto nuevo */}
                        <button type="button" onClick={handleAddProduct}>
                            Agregar Producto
                        </button>

                        {/* Mostrar botón para eliminar productos, si hay más de uno */}
                        {usedProducts.length > 1 && (
                            <button type="button" onClick={() => handleRemoveProduct(usedProducts.length - 1)}>
                                Eliminar Último Producto
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
