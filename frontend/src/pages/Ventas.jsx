import Table from '@components/Table';
import useSales from '@hooks/ventas/useGetSales.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupSale';
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
    dataSale,
    setDataSale,
    isPopupOpen,
    setIsPopupOpen,
  } = useEditSale(fetchSales, setSales);

  const { handleDelete } = useDeleteSale(fetchSales, setDataSale);
  const { handleCreate } = useCreateSale(fetchSales, setSales);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedSales) => {
      setDataSale(selectedSales.length > 0 ? selectedSales[0] : {});
    },
    [setDataSale]
  );

  const columns = [
    { title: 'ID Venta', field: 'id_venta', width: 100, responsive: 0 },
    { title: 'Técnico (RUT)', field: 'rut_trabajador', width: 100, responsive: 1 },
    { title: 'Cliente (RUT)', field: 'rut_cliente', width: 100, responsive: 1 },
    { title: 'Fecha Venta', field: 'fecha_venta', width: 150, responsive: 2 },
    {
      title: 'Artículos Vendidos',
      field: 'items',
      width: 200,
      responsive: 2,
      render: rowData => (
        rowData.items && rowData.items.length > 0 && (
          rowData.items.map(item => (
            <div key={item.id_item}>
              {`ID Artículo: ${item.id_item}, Cantidad: ${item.cantidad}`}
            </div>
          ))
        )
      )
    },
    { title: 'Total Venta', field: 'total', width: 100, responsive: 1 },
    { title: 'Tiempo de Creación', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setIsPopupOpen(true);
  };

  const handleDeleteClick = () => {
    if (dataSale && dataSale.id_venta) {
      handleDelete([dataSale]);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Ventas</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID Venta'} />
            <button onClick={handleUpdateClick} disabled={!dataSale.id_venta}>
              {dataSale.id_venta ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            <button className="delete-sale-button" onClick={handleDeleteClick} disabled={!dataSale.id_venta}>
              {dataSale.id_venta ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            <button onClick={() => { setDataSale({}); setIsPopupOpen(true); }}>
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
        data={dataSale}
        action={dataSale && dataSale.id_venta ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default Sales;
