import Table from '@components/Table';
import useOrders from '@hooks/ordenes/useGetOrders.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupOrder';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/orders.css';
import useEditOrder from '@hooks/ordenes/useEditOrder';
import useDeleteOrder from '@hooks/ordenes/useDeleteOrder';
import useCreateOrder from '@hooks/ordenes/useCreateOrder';

const Orders = () => {
  const { orders, fetchOrders, setOrders } = useOrders();
  const [filterId, setFilterId] = useState('');

  const {
    handleUpdate,
    dataOrder,
    setDataOrder,
    isPopupOpen,
    setIsPopupOpen,
  } = useEditOrder(fetchOrders, setOrders);

  const { handleDelete } = useDeleteOrder(fetchOrders, setDataOrder);
  const { handleCreate } = useCreateOrder(fetchOrders, setOrders);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedOrders) => {
      setDataOrder(selectedOrders.length > 0 ? selectedOrders[0] : {});
    },
    [setDataOrder]
  );

  const columns = [
    { title: 'ID Orden', field: 'id_orden', width: 100, responsive: 0 },
    { title: 'Técnico (RUT)', field: 'rut_trabajador', width: 100, responsive: 1 },
    { title: 'Tipo de Orden', field: 'tipo_orden', width: 150, responsive: 2 },
    { title: 'Estado', field: 'estado_orden', width: 150, responsive: 2 },
    { title: 'Fecha de Orden', field: 'fecha_orden', width: 150, responsive: 2 },
    { title: 'Total', field: 'total', width: 150, responsive: 1 },
    { title: 'Hora de Inicio', field: 'hora_inicio', width: 200, responsive: 0 },
    { title: 'Hora de Fin', field: 'hora_fin', width: 200, responsive: 0 },
    { title: 'Tiempo de Creación', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setIsPopupOpen(true);
  };

  const handleDeleteClick = () => {
    if (dataOrder && dataOrder.id_orden) {
      handleDelete([dataOrder]);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Órdenes</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID Orden'} />
            <button onClick={handleUpdateClick} disabled={!dataOrder.id_orden}>
              {dataOrder.id_orden ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            <button className="delete-order-button" onClick={handleDeleteClick} disabled={!dataOrder.id_orden}>
              {dataOrder.id_orden ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            {/* <button onClick={() => { setDataOrder({}); setIsPopupOpen(true); }} >
              +
            </button> */}
          </div>
        </div>
        <Table
          data={orders}
          columns={columns}
          filter={filterId}
          dataToFilter="id_orden"
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <Popup
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={dataOrder}
        action={dataOrder && dataOrder.id_orden ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default Orders;
