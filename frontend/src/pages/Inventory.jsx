import Table from '@components/Table';
import useInventory from '@hooks/inventory/useGetInventory';
import Search from '../components/Search';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import useEditInventory from '@hooks/inventory/useEditInventory';
import useDeleteInventory from '@hooks/inventory/useDeleteInventory';
import useCreateInventory from '@hooks/inventory/useCreateInventory';
import PopupInventory from '../components/PopupInventory';

const Inventory = () => {
  const { inventory, fetchInventory, setInventory } = useInventory();
  const [filterId, setFilterId] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const {
    handleUpdate,
    dataInventory = {},
    setDataInventory,
  } = useEditInventory(setInventory);

  const { handleDelete } = useDeleteInventory(fetchInventory, setDataInventory);
  const { handleCreate } = useCreateInventory(setInventory);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedItems) => {
      setDataInventory(selectedItems.length > 0 ? selectedItems[0] : {});
    },
    [setDataInventory]
  );

  const columns = [
    { title: 'ID Inventario', field: 'id', width: 100 },
    { title: 'Nombre', field: 'name', width: 350 },
    { title: 'Tipo', field: 'type', width: 150 },
    { title: 'Cantidad', field: 'quantity', width: 150 },
    { title: 'Precio', field: 'price', width: 150 },
    { title: 'Fecha Creación', field: 'createdAt', width: 200 },
  ];


  const isDataInventoryValid = dataInventory && dataInventory.id;

  const handleInventoryAction = (inventoryData) => {
    if (isDataInventoryValid) {
      handleUpdate(inventoryData);
    } else {
      handleCreate(inventoryData);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Inventario</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID'} />
            <button onClick={() => setShowPopup(true)} disabled={!isDataInventoryValid}>
              {isDataInventoryValid ? <img src={UpdateIcon} alt="edit" /> : <img src={UpdateIconDisable} alt="edit-disabled" />}
            </button>
            <button onClick={() => handleDelete([dataInventory])} disabled={!isDataInventoryValid}>
              {isDataInventoryValid ? <img src={DeleteIcon} alt="delete" /> : <img src={DeleteIconDisable} alt="delete-disabled" />}
            </button>
            <button onClick={() => { setDataInventory({}); setShowPopup(true); }}>
              +
            </button>
          </div>
        </div>
        <Table
          data={inventory}
          columns={columns}
          filter={filterId}
          dataToFilter="id"
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <PopupInventory
        show={showPopup}
        setShow={setShowPopup}
        data={dataInventory}
        action={handleInventoryAction}
      />
    </div>
  );
};

export default Inventory;
