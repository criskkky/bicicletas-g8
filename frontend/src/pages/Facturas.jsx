import Table from '@components/Table';
import useInvoices from '@hooks/facturas/useGetInvoices.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupInvoice';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/invoices.css';
import useEditInvoice from '@hooks/facturas/useEditInvoice';
import useDeleteInvoice from '@hooks/facturas/useDeleteInvoice';
import useCreateInvoice from '@hooks/facturas/useCreateInvoice';

const Invoices = () => {
  const { invoices, fetchInvoices, setInvoices } = useInvoices();
  const [filterId, setFilterId] = useState('');

  const {
    handleUpdate,
    dataInvoice,
    setDataInvoice,
    isPopupOpen,
    setIsPopupOpen,
  } = useEditInvoice(fetchInvoices, setInvoices);

  const { handleDelete } = useDeleteInvoice(fetchInvoices, setDataInvoice);
  const { handleCreate } = useCreateInvoice(fetchInvoices, setInvoices);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedInvoices) => {
      setDataInvoice(selectedInvoices.length > 0 ? selectedInvoices[0] : {});
    },
    [setDataInvoice]
  );

  const columns = [
    { title: 'ID Factura', field: 'id_factura', width: 100, responsive: 0 },
    { title: 'Técnico (RUT)', field: 'rut_trabajador', width: 150, responsive: 1 },
    { title: 'Cliente (RUT)', field: 'rut_cliente', width: 150, responsive: 1 },
    { title: 'Fecha de Factura', field: 'fecha_factura', width: 150, responsive: 2 },
    { title: 'Método de Pago', field: 'metodo_pago', width: 150, responsive: 2 },
    { title: 'Tipo de Factura', field: 'tipo_factura', width: 150, responsive: 2 },
    { title: 'Total', field: 'total', width: 100, responsive: 1 },
    { title: 'Tiempo de Creación', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setIsPopupOpen(true);
  };

  const handleDeleteClick = () => {
    if (dataInvoice && dataInvoice.id_factura) {
      handleDelete([dataInvoice]);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Facturas</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID Factura'} />
            <button onClick={handleUpdateClick} disabled={!dataInvoice.id_factura}>
              {dataInvoice.id_factura ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            <button className="delete-invoice-button" onClick={handleDeleteClick} disabled={!dataInvoice.id_factura}>
              {dataInvoice.id_factura ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            <button onClick={() => { setDataInvoice({}); setIsPopupOpen(true); }}>
              +
            </button>
          </div>
        </div>
        <Table
          data={invoices}
          columns={columns}
          filter={filterId}
          dataToFilter="id_factura"
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <Popup
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={dataInvoice}
        action={dataInvoice && dataInvoice.id_factura ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default Invoices;