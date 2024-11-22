import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function Popup({ show, setShow, data, action }) {
    // Determinar si es edición o creación basándonos en la existencia de datos
    const isEdit = data && Object.keys(data).length > 0;
    const maintenanceData = isEdit ? data : {};

    const handleSubmit = (formData) => {
        action(formData); // Llama a la acción (crear o editar)
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Close" />
                        </button>
                        <Form
                            title={isEdit ? "Editar mantenimiento" : "Crear mantenimiento"} // Dinámico
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
                                {
                                    label: "ID(s) de artículo(s) usado(s)",
                                    name: "idItemUsed",
                                    defaultValue: maintenanceData.idItemUsed || "",
                                    placeholder: "IDs de artículos usados",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Cantidad usada",
                                    name: "quantityUsed",
                                    defaultValue: maintenanceData.quantityUsed || "",
                                    placeholder: "Cantidad de artículo usado",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                }
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar cambios" : "Crear mantenimiento"} // Dinámico
                            backgroundColor={"#fff"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
