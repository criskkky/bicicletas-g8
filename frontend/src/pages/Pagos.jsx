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

const Payments = () => {
  const { payments, fetchPayments, setPayments } = usePayments();
  const [filterId, setFilterId] = useState('');

  const {
    handleEditPayment,
    dataPayment,
    setDataPayment,
    isPopupOpen,
    setIsPopupOpen,
  } = useEditPayment(fetchPayments, setPayments);

  const { handleDeletePayment } = useDeletePayment(fetchPayments, setDataPayment);
  const { handleCreatePayment } = useCreatePayment(setPayments);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedPayments) => {
      setDataPayment(selectedPayments?.length > 0 ? selectedPayments[0] : {});
    },
    [setDataPayment]
  );

  const columns = [
    { title: 'ID Pago', field: 'id_pago', width: 100, responsive: 0 },
    { title: 'Técnico (RUT)', field: 'rut_trabajador', width: 150, responsive: 1 },
    { title: 'Fecha de Pago', field: 'fecha_pago', width: 150, responsive: 1 },
    { title: 'Estado', field: 'estado', width: 100, responsive: 2 },
    { title: 'Método de Pago', field: 'metodo_pago', width: 150, responsive: 2 },
    { title: 'Cantidad de Órdenes', field: 'cantidad_ordenes_realizadas', width: 200, responsive: 3 },
    { title: 'Horas Trabajadas', field: 'horas_trabajadas', width: 200, responsive: 3 },
    { title: 'Monto', field: 'monto', width: 150, responsive: 3 },
    { title: 'Creado', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setIsPopupOpen(true);
  };

  const handleDeleteClick = () => {
    if (dataPayment && dataPayment?.id_pago) {
      handleDeletePayment(dataPayment?.id_pago);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Pagos</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID Pago'} />
            <button onClick={handleUpdateClick} disabled={!dataPayment?.id_pago}>
              {dataPayment?.id_pago ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            <button className="delete-payment-button" onClick={handleDeleteClick} disabled={!dataPayment?.id_pago}>
              {dataPayment?.id_pago ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            <button onClick={() => { setDataPayment({}); setIsPopupOpen(true); }}>
              +
            </button>
          </div>
        </div>
        <Table
          data={payments}
          columns={columns}
          filter={filterId}
          dataToFilter="id_pago"
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <Popup
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={dataPayment}
        action={dataPayment && dataPayment?.id_pago ? handleEditPayment : handleCreatePayment}
      />
    </div>
  );
};

export default Payments;
