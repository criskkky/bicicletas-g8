import  {useState} from 'react';
import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupSale({ show, setShow, inventoryItems = [], onPurchase }) {
    const [error, setError] = useState("")

    const handlePurchase = (formData) => {
        const selectedProduct = inventoryItems.find(item => item.name === formData.productName);
        
        if (selectedProduct) {
            const requestQuantity = formData.quantity;

            if (requestQuantity > selectedProduct.quantity) {
                setError(`La cantidad solicitada supera el inventario disponible.\nActualmente hay ${selectedProduct.quantity} unidades disponibles.`);
                return;
            }
            

            setError("");

            const purchaseData = {
                inventoryItemId: selectedProduct.id,
                quantity: formData.quantity,
            };
            onPurchase(purchaseData);
        }
    };

    const aviableProducts = inventoryItems.filter(item => item.quantity > 0);

    return (
        <div>
            { show && (
            <div className="bg">
                <div className="popup">
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} />
                    </button>
                    <Form
                        title="Comprar Producto"
                        fields={[
                            {
                                label: "Nombre del producto",
                                name: "productName",
                                fieldType: 'select',
                                options: aviableProducts.map(item => ({
                                    value: item.name,
                                    label: item.name,
                                })),
                                defaultValue: "",
                                required: true,
                            },
                            {
                                label: "Cantidad",
                                name: "quantity",
                                defaultValue: 1,
                                fieldType: 'input',
                                type: "number",
                                min: 1,
                                required: true,
                            }
                        ]}
                        onSubmit={handlePurchase}
                        buttonText="Comprar ahora"
                        backgroundColor={'#fff'}
                    />
                        {error && (
                            <div className="error-message">
                                <span className="error-text">{error}</span>
                            </div>
                        )}
                </div>
            </div>
            )}
        </div>
    );
}