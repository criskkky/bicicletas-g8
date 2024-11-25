import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupSale({ show, setShow, productData = {}, onPurchase }) {
    const handlePurchase = (formData) => {
        const purchaseData = {
            inventoryItemId: productData.inventoryItem?.id,
            quantity: formData.quantity,
        };

        onPurchase(purchaseData);
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
                                label: "ID del producto",
                                name: "productName",
                                fieldType: 'input',
                                type: "number",
                                defaultValue: productData.inventoryItem?.name || "",
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