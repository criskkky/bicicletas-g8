import Form from './Form';
import '@styles/popup_1.css';
import CloseIcon from '@assets/XIcon.svg'; // Asegúrate de tener este icono o uno similar

export default function PopupInventory({ show, setShow, inventoryItem = {}, onSave, onDelete }) {
    // Maneja la lógica de agregar o editar el artículo
    const handleSave = (formData) => {
        const itemData = {
            name: formData.name,
            quantity: formData.quantity,
            price: formData.price,
            type: formData.type,
        };

        if (inventoryItem?.id) {
            // Editar el artículo si tiene id
            onSave(inventoryItem.id, itemData);
        } else {
            // Agregar nuevo artículo
            onSave(null, itemData);
        }
    };

    // Maneja la eliminación de un artículo
    const handleDelete = () => {
        if (inventoryItem?.id) {
            onDelete(inventoryItem.id);
        }
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
                            title={inventoryItem?.id ? "Editar Artículo" : "Agregar Artículo"}
                            fields={[
                                {
                                    label: "Nombre",
                                    name: "name",
                                    fieldType: 'input',
                                    type: "text",
                                    defaultValue: inventoryItem?.name || "",
                                    required: true,
                                },
                                {
                                    label: "Cantidad",
                                    name: "quantity",
                                    fieldType: 'input',
                                    type: "number",
                                    min: 1,
                                    defaultValue: inventoryItem?.quantity || 1,
                                    required: true,
                                },
                                {
                                    label: "Precio",
                                    name: "price",
                                    fieldType: 'input',
                                    type: "number",
                                    min: 0,
                                    defaultValue: inventoryItem?.price || 0,
                                    required: true,
                                },
                                {
                                    label: "Tipo",
                                    name: "type",
                                    fieldType: 'input',
                                    type: "text",
                                    defaultValue: inventoryItem?.type || "",
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSave}
                            buttonText={inventoryItem?.id ? "Actualizar Artículo" : "Agregar Artículo"}
                            backgroundColor={'#fff'}
                        />
                        {inventoryItem?.id && (
                            <button className="delete" onClick={handleDelete}>Eliminar Artículo</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
