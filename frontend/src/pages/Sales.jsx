import Table from '@components/Table';
import useSales from '@hooks/sales/useGetSales';
import Search from '../components/Search';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import useEditSale from '@hooks/sales/useEditSale';
import useDeleteSale from '@hooks/sales/useDeleteSale';
import useCreateSale from '@hooks/sales/useCreateSale';
import PopupSale from '../components/PopupSale';

const Sales = () => {
  const { sales, fetchSales, setSales } = useSales();
  const [filterId, setFilterId] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const {
    handleUpdate,
    dataSale = {},
    setDataSale,
  } = useEditSale(setSales);


  const { handleDelete } = useDeleteSale(fetchSales, setDataSale);
  const { handleCreate } = useCreateSale(setSales); 

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
    { title: 'ID Venta', field: 'id', width: 100 },
    { title: 'Artículo', field: 'inventoryItemName', width: 350 },
    { title: 'Cantidad', field: 'quantity', width: 150 },
    { title: 'Precio Total', field: 'totalPrice', width: 200 },
    { title: 'Fecha de Venta', field: 'createdAt', width: 200 },
    { title: 'Precio Artículo', field: 'inventoryItemPrice', width: 150 },
    { title: 'Tipo de Artículo', field: 'inventoryItemType', width: 150 },
];

  const isDataSaleValid = dataSale && dataSale.id;

  const handlePurchase = (purchaseData) => {
    if (isDataSaleValid) {
      handleUpdate(purchaseData);
    } else {
      handleCreate(purchaseData);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Ventas</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID'} />
            <button onClick={() => setShowPopup(true)} disabled={!isDataSaleValid}>
              {isDataSaleValid ? <img src={UpdateIcon} alt="edit" /> : <img src={UpdateIconDisable} alt="edit-disabled" />}
            </button>
            <button onClick={() => handleDelete([dataSale])} disabled={!isDataSaleValid}>
              {isDataSaleValid ? <img src={DeleteIcon} alt="delete" /> : <img src={DeleteIconDisable} alt="delete-disabled" />}
            </button>
            <button onClick={() => { setDataSale({}); setShowPopup(true); }}>
              +
            </button>
          </div>
        </div>
        <Table
          data={sales}
          columns={columns}
          filter={filterId}
          dataToFilter="id"
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <PopupSale
        show={showPopup}
        setShow={setShowPopup}
        data={dataSale}
        action={handlePurchase} 
      />
    </div>
  );
};

export default Sales;
