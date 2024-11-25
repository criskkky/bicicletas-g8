import Table from '@components/Table';
import useOrders from '@hooks/orders/useGetOrders.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupOrder';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/orders.css';
import useEditOrder from '@hooks/orders/useEditOrder';
import useDeleteOrder from '@hooks/orders/useDeleteOrder';
import useCreateOrder from '@hooks/orders/useCreateOrder';

const Order = () => {
  const { orders, fetchOrders, setOrders } = useOrders();
  const [filterId, setFilterId] = useState('');

  const {
    handleUpdate,
    dataOrder,
    setDataOrder,
  } = useEditOrder(setOrders);

  const { handleDelete } = useDeleteOrder(fetchOrders, setDataOrder);
  const { handleCreate } = useCreateOrder(setOrders); // Manejo de creación
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar el popup

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  // Maneja los pedidos seleccionados desde la tabla
  const handleSelectionChange = useCallback(
    (selectedOrders) => {
      // Asegúrate de que dataOrder siempre tenga una estructura válida
      setDataOrder(selectedOrders.length > 0 ? selectedOrders[0] : { id: null }); // Selecciona solo el primero
    },
    [setDataOrder]
  );

  const columns = [
    { title: 'ID Pedido', field: 'id', width: 100, responsive: 0 },
    { title: 'Descripción', field: 'description', width: 350, responsive: 4 },
    { title: 'Cliente', field: 'customer', width: 300, responsive: 3 },
    { title: 'Estado', field: 'status', width: 150, responsive: 0 },
    { title: 'Fecha', field: 'date', width: 200, responsive: 0 },
    {
      title: 'ID(s) de artículo(s) usado(s)', 
      field: 'inventoryItems', 
      width: 300, 
      responsive: 3,
      render: rowData => (
        rowData.inventoryItems && rowData.inventoryItems.length > 0 ? (
          rowData.inventoryItems.map(item => (
            <div key={item.idUsedItem}>
              {`ID: ${item.idUsedItem}, Cantidad: ${item.quantityUsed}`}
            </div>
          ))
        ) : (
          <div>No se han utilizado artículos</div> // Mensaje cuando no hay artículos
        )
      )
    },
    { title: 'Creado', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setShowPopup(true); // Abre el popup en modo edición
  };

  const handleDeleteClick = () => {
    if (dataOrder && dataOrder.id) {
      handleDelete([dataOrder]); // Llama al handler de eliminación solo si 'dataOrder' tiene un ID
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Pedidos</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID'} />
            {/* Botón de editar */}
            <button onClick={handleUpdateClick} disabled={!dataOrder || !dataOrder.id}>
              {dataOrder && dataOrder.id ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            {/* Botón de eliminar */}
            <button className="delete-order-button" onClick={handleDeleteClick} disabled={!dataOrder || !dataOrder.id}>
              {dataOrder && dataOrder.id ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            {/* Botón de crear */}
            <button onClick={() => { setDataOrder({ id: null }); setShowPopup(true); }}>
              +
            </button>
          </div>
        </div>
        <Table
          data={orders}
          columns={columns}
          filter={filterId}
          dataToFilter="id"
          onSelectionChange={handleSelectionChange} // Actualiza la selección según selección en la tabla
        />
      </div>

      {/* Popup para crear o editar pedidos */}
      <Popup
        show={showPopup}
        setShow={setShowPopup}
        data={dataOrder}
        action={dataOrder && dataOrder.id ? handleUpdate : handleCreate} // Crear o actualizar
      />
    </div>
  );
};

export default Order;
