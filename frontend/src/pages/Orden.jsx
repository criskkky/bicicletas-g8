import Table from '@components/Table';
import useOrders from '@hooks/orden/useGetOrders';
import Search from '../components/Search';
import PopupOrder from '../components/PopupOrder';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/orders.css';
import useEditOrder from '@hooks/orden/useEditOrder';
import useDeleteOrder from '@hooks/orden/useDeleteOrder';  
import useCreateOrder from '@hooks/orden/useCreateOrder';

const Order = () => {
  const { orders, fetchOrders, setOrders } = useOrders();
  const [filterId, setFilterId] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [dataOrder, setDataOrder] = useState({ id: null });

  const { handleUpdate } = useEditOrder(setOrders);
  const { deleteOrderById } = useDeleteOrder(fetchOrders, setDataOrder);
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
      handleUpdate(orderData); 
    } else {
      handleCreate(orderData); 
    }
    setShowPopup(false);
  };

  const columns = [
    { title: 'ID Orden', field: 'id', width: 100 },
    { title: 'RUT Trabajador', field: 'workerRUT', width: 150 },
    { title: 'Tipo de Trabajo', field: 'jobType', width: 150 },
    { title: 'ID Trabajo', field: 'jobID', width: 150 },
    { title: 'Horas Trabajadas', field: 'hoursWorked', width: 150 },
    { title: 'Nota', field: 'note', render: (rowData) => rowData.note || 'N/A', width: 250 },
    { title: 'Creado', field: 'createdAt', width: 200 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200 },
  ];

  const handleUpdateClick = () => {
    if (dataOrder && dataOrder.id) {
      setShowPopup(true); 
    }
  };

  const handleDeleteClick = () => {
    if (dataOrder && dataOrder.id) {
      deleteOrderById(dataOrder.id); 
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">ordenes de Trabajo</h1>
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

      <PopupOrder
        show={showPopup}
        setShow={setShowPopup}
        data={dataOrder}
        action={handleCreateOrUpdate}
      />
    </div>
  );
};

export default Order;
