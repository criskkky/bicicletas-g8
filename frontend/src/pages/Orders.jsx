import Table from '@components/Table';
import useOrders from '@hooks/orders/useGetOrders.jsx';
import Search from '../components/Search';
import PopupOrder from '../components/PopupOrder'; // Cambio aquí
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
  const [showPopup, setShowPopup] = useState(false);
  const [dataOrder, setDataOrder] = useState({ id: null }); // Estado de la orden seleccionada

  const { handleUpdate } = useEditOrder(setOrders);
  const { handleDelete } = useDeleteOrder(fetchOrders, setDataOrder);
  const { handleCreate } = useCreateOrder(setOrders);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedOrders) => {
      setDataOrder(selectedOrders.length > 0 ? selectedOrders[0] : { id: null });
    },
    []
  );

  const handleCreateOrUpdate = (orderData) => {
    if (orderData.id) {
      handleUpdate(orderData); // Actualizar orden existente
    } else {
      handleCreate(orderData); // Crear nueva orden
    }
    setShowPopup(false);
  };

  const columns = [
    { title: 'ID Orden', field: 'id', width: 100 },
    { title: 'Cliente', field: 'customer', width: 200 },
    { title: 'Problema', field: 'description', width: 300 },
    { title: 'Servicio Solicitado', field: 'service', width: 250 },
    { title: 'Técnico Asignado', field: 'technician', width: 200 },
    { title: 'Tiempo Dedicado (hrs)', field: 'hoursWorked', width: 150 },
    { title: 'Estado', field: 'status', width: 150 },
    { 
      title: 'Productos Usados', 
      field: 'inventoryItems', 
      render: (rowData) => (
        rowData.inventoryItems && rowData.inventoryItems.length > 0 ? (
          <ul>
            {rowData.inventoryItems.map(item => (
              <li key={item.idUsedItem}>{`ID: ${item.idUsedItem}, Cantidad: ${item.quantityUsed}`}</li>
            ))}
          </ul>
        ) : 'N/A'
      )
    },
    { title: 'Creado', field: 'createdAt', width: 200 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200 },
  ];

  const handleUpdateClick = () => {
    setShowPopup(true); // Abre el popup para editar
  };

  const handleDeleteClick = () => {
    if (dataOrder && dataOrder.id) {
      handleDelete([dataOrder]);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Órdenes de Trabajo</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder="Filtrar por ID" />
            <button onClick={handleUpdateClick} disabled={!dataOrder || !dataOrder.id}>
              {dataOrder && dataOrder.id ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            <button onClick={handleDeleteClick} disabled={!dataOrder || !dataOrder.id}>
              {dataOrder && dataOrder.id ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            <button onClick={() => { setDataOrder({ id: null }); setShowPopup(true); }}>+</button>
          </div>
        </div>
        <Table
          data={orders}
          columns={columns}
          filter={filterId}
          dataToFilter="id"
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <PopupOrder // Cambio aquí
        show={showPopup}
        setShow={setShowPopup}
        data={dataOrder}
        action={handleCreateOrUpdate}
      />
    </div>
  );
};

export default Order;
