import { deleteSale } from '@services/ventas.service.js';

const useDeleteSale = (setSales) => {
    const handleDelete = async (salesToDelete) => {
        try {
            await Promise.all(salesToDelete.map(sale => deleteSale(sale.id)));
            setSales(prevState => prevState.filter(sale => !salesToDelete.some(deleted => deleted.id === sale.id)));
        } catch (error) {
            console.error("Error al eliminar venta:", error);
        }
    };

    return { handleDelete };
};

export default useDeleteSale;
