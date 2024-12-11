import Table from '@components/Table';
import useSales from '@hooks/ventas/useGetSales.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupSales';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/sales.css';
import useEditSale from '@hooks/ventas/useEditSale';
import useDeleteSale from '@hooks/ventas/useDeleteSale';
import useCreateSale from '@hooks/ventas/useCreateSale';

const Sales = () => {
  const { sales, fetchSales, setSales } = useSales();
  const [filterId, setFilterId] = useState('');

  const {
    handleUpdate,
    sale,
    setSale,
    isPopupOpen,
    setIsPopupOpen,
  } = useEditSale(fetchSales, setSales);

  const { handleDelete } = useDeleteSale(fetchSales, setSale);
  const { handleCreate } = useCreateSale(fetchSales, setSales);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedSales) => {
      setSale(selectedSales.length > 0 ? selectedSales[0] : {});
    },
    [setSale]
  );

  const columns = [
    { title: 'ID Venta', field: 'id_venta', width: 100, responsive: 0 },
    { title: 'Técnico (RUT)', field: 'rut_trabajador', width: 100, responsive: 1 },
    { title: 'Cliente (RUT)', field: 'rut_cliente', width: 100, responsive: 1 },
    { title: 'Fecha Venta', field: 'fecha_venta', width: 150, responsive: 2 },
    { title: 'Total', field: 'total', width: 150, responsive: 2 },
    { title: 'Tiempo de Creación', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setIsPopupOpen(true);
  };

  const handleDeleteClick = () => {
    if (sale && sale.id_venta) {
      handleDelete([sale]);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Ventas</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID Venta'} />
            <button onClick={handleUpdateClick} disabled={!sale.id_venta}>
              {sale.id_venta ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            <button className="delete-sale-button" onClick={handleDeleteClick} disabled={!sale.id_venta}>
              {sale.id_venta ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            <button onClick={() => { setSale({}); setIsPopupOpen(true); }}>
              +
            </button>
          </div>
        </div>
        <Table
          data={sales}
          columns={columns}
          filter={filterId}
          dataToFilter="id_venta"
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <Popup
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={sale}
        action={sale && sale.id_venta ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default Sales;
