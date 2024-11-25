import Table from '@components/Table';
import useGetOrder from '@hooks/orders/useGetOrder.jsx';
import Search from '../components/Search';
import PopupOrder from '../components/PopupOrder';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/orders.css';
import useEditOrder from '@hooks/orders/useEditOrder';
import useDeleteOrder from '@hooks/orders/useDeleteOrder';
import useCreateOrder from '@hooks/orders/useCreateOrder';

const Orders = () => {
  const { orders, isLoading, error } = useGetOrder(); // Obtener órdenes desde el hook
  const { createNewOrder } = useCreateOrder();
  const { deleteOrderById } = useDeleteOrder();
  const { editOrder } = useEditOrder();
  
  const [showPopup, setShowPopup] = useState(false); // Controlar la visibilidad del popup
  const [currentOrder, setCurrentOrder] = useState(null); // Orden seleccionada para editar
  const [filterId, setFilterId] = useState(''); // Filtro de ID

  const handleCreateOrder = (orderData) => {
    createNewOrder(orderData).then(() => {
      setShowPopup(false); // Cierra el popup al crear
    });
  };

  const handleEditOrder = (orderId, updatedData) => {
    editOrder(orderId, updatedData).then(() => {
      setShowPopup(false); // Cierra el popup al editar
    });
  };

  const handleDeleteOrder = (orderId) => {
    deleteOrderById(orderId).then(() => {
      alert("Orden eliminada correctamente.");
    });
  };

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value); // Cambia el filtro según el ID
  };

  const handleSelectionChange = useCallback(
    (selectedOrders) => {
      setCurrentOrder(selectedOrders.length > 0 ? selectedOrders[0] : {}); // Selecciona solo el primero
    },
    []
  );

  const columns = [
    { title: 'ID Orden', field: 'id', width: 100, responsive: 0 },
    { title: 'Cliente', field: 'client', width: 250, responsive: 3 },
    { title: 'Problema', field: 'problem', width: 350, responsive: 4 },
    { title: 'Estado', field: 'status', width: 150, responsive: 3 },
    { title: 'Fecha de Creación', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  if (isLoading) return <div>Cargando órdenes...</div>;
  if (error) return <div>Error al cargar las órdenes: {error}</div>;

  return (
    <div className="orders-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Órdenes de Trabajo</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID'} />
            {/* Botón de editar */}
            <button onClick={() => setShowPopup(true)} disabled={!currentOrder.id}>
              {currentOrder.id ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            {/* Botón de eliminar */}
            <button onClick={() => handleDeleteOrder(currentOrder.id)} disabled={!currentOrder.id}>
              {currentOrder.id ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            {/* Botón de crear */}
            <button onClick={() => { setCurrentOrder(null); setShowPopup(true); }}>
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

      {/* Popup para crear o editar órdenes */}
      <PopupOrder
        show={showPopup}
        setShow={setShowPopup}
        order={currentOrder}
        onCreate={handleCreateOrder}
        onEdit={handleEditOrder}
      />
    </div>
  );
};

export default Orders;
