import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupSale({ show, setShow, inventoryItems = [], onPurchase }) {
    const handlePurchase = (formData) => {
        const selectedProduct = inventoryItems.find(item => item.name === formData.productName);
        
        if (selectedProduct) {
            const purchaseData = {
                inventoryItemId: selectedProduct.id,
                quantity: formData.quantity,
            };
            onPurchase(purchaseData);
        }
    };

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
                                options: inventoryItems.map(item => ({
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
                </div>
            </div>
            )}
        </div>
    );
}