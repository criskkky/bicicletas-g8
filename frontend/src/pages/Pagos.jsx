import Table from '@components/Table';
import usePayments from '@hooks/pagos/useGetPayments.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupPayment';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/payments.css';
import useEditPayment from '@hooks/pagos/useEditPayment';
import useDeletePayment from '@hooks/pagos/useDeletePayment';
import useCreatePayment from '@hooks/pagos/useCreatePayment';

const Payment = () => {
  const { payments, fetchPayments, setPayments } = usePayments();
  const [filterId, setFilterId] = useState('');

  const {
    handleUpdate,
    dataPayment,
    setDataPayment,
  } = useEditPayment(setPayments);

  const { handleDelete } = useDeletePayment(fetchPayments, setDataPayment);
  const { handleCreate } = useCreatePayment(setPayments); // Manejo de creación
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar el popup

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  // Maneja los pagos seleccionados desde la tabla
  const handleSelectionChange = useCallback(
    (selectedPayments) => {
      setDataPayment(selectedPayments.length > 0 ? selectedPayments[0] : {}); // Selecciona solo el primero
    },
    [setDataPayment]
  );

  const columns = [
    { title: 'ID PAGO', field: 'id', width: 100, responsive: 0 },
    { title: 'Cliente', field: 'cliente', width: 350, responsive: 4 },
    { title: 'Técnico Asignado', field: 'technician', width: 300, responsive: 3 },
    { title: 'Monto', field: 'monto', width: 150, responsive: 0 },
    { title: 'Fecha', field: 'date', width: 200, responsive: 0 },
    { title: 'Creado', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setShowPopup(true); // Abre el popup en modo edición
  };

  const handleDeleteClick = () => {
    if (dataPayment && dataPayment.id) {
      handleDelete([dataPayment]); // Llama al handler de eliminación solo si 'dataPayment' tiene un ID
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Pagos</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID'} />
            {/* Botón de editar */}
            <button onClick={handleUpdateClick} disabled={!dataPayment.id}>
              {dataPayment.id ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            {/* Botón de eliminar */}
            <button className="delete-payment-button" onClick={handleDeleteClick} disabled={!dataPayment.id}>
              {dataPayment.id ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            {/* Botón de crear */}
            <button onClick={() => { setDataPayment({}); setShowPopup(true); }}>
              +
            </button>
          </div>
        </div>
        <Table
          data={payments}
          columns={columns}
          filter={filterId}
          dataToFilter="id"
          onSelectionChange={handleSelectionChange} // Actualiza la selección según selección en la tabla
        />
      </div>

      {/* Popup para crear o editar pagos */}
      <Popup
        show={showPopup}
        setShow={setShowPopup}
        data={dataPayment}
        action={dataPayment.id ? handleUpdate : handleCreate} // Crear o actualizar
      />
    </div>
  );
};

export default Payment;
