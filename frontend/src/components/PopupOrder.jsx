import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupOrder({ show, setShow, data, action }) {
    
    const isEdit = data && Object.keys(data).length > 0;
    const orderData = isEdit ? data : {};

    const handleSubmit = (formData) => {
        action(formData); 
        setShow(false);  
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup" style={{ overflow: "auto" }}>
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title={isEdit ? "Editar Orden" : "Nueva Orden"}
                            fields={[
                                {
                                    label: "RUT Trabajador",
                                    name: "workerRUT",
                                    defaultValue: orderData.workerRUT || "",
                                    placeholder: "Ej. 12345678-9",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    pattern: "\\d{7,8}-[0-9kK]", 
                                },
                                {
                                    label: "Tipo de Trabajo Realizado",
                                    name: "jobType",
                                    fieldType: "select",
                                    options: [
                                        { value: "Mantenimiento", label: "Mantenimiento" },
                                        { value: "Venta", label: "Venta" },
                                    ],
                                    required: true,
                                    defaultValue: orderData.jobType || "Mantenimiento",
                                },
                                {
                                    label: "ID Trabajo Realizado",
                                    name: "jobID",
                                    defaultValue: orderData.jobID || "",
                                    placeholder: "Ej. 00123",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Cantidad de Horas Trabajadas",
                                    name: "hoursWorked",
                                    defaultValue: orderData.hoursWorked || 0,
                                    placeholder: "Horas dedicadas",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                    min: 0,
                                },
                                {
                                    label: "Nota (Opcional)",
                                    name: "note",
                                    defaultValue: orderData.note || "",
                                    placeholder: "Observaciones adicionales",
                                    fieldType: "textarea",
                                    maxLength: 300,
                                    required: false,
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
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar Cambios" : "Crear Orden"}
                            backgroundColor={"#fff"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
