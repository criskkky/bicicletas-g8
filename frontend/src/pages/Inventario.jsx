import Table from '@components/Table';
import useInventoryItems from '@hooks/inventario/useGetInventoryItems.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupInventory';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/inventory.css';
import useEditInventoryItem from '@hooks/inventario/useEditInventoryItem';
import useDeleteInventoryItem from '@hooks/inventario/useDeleteInventoryItem';
import useCreateInventoryItem from '@hooks/inventario/useCreateInventoryItem';

const Inventory = () => {
  const { inventoryItems, fetchInventoryItems, setInventoryItems } = useInventoryItems();
  const [filterId, setFilterId] = useState('');

  const {
    handleUpdate,
    inventoryItem,
    setInventoryItem,
    isPopupOpen,
    setIsPopupOpen,
  } = useEditInventoryItem(fetchInventoryItems, setInventoryItems);

  const { handleDelete } = useDeleteInventoryItem(fetchInventoryItems, setInventoryItem);
  const { handleCreate } = useCreateInventoryItem(fetchInventoryItems, setInventoryItems);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedItems) => {
      setInventoryItem(selectedItems.length > 0 ? selectedItems[0] : {});
    },
    [setInventoryItem]
  );

  const columns = [
    { title: 'ID Artículo', field: 'id_item', width: 100, responsive: 0 },
    { title: 'Nombre', field: 'nombre', width: 200, responsive: 1 },
    { title: 'Marca', field: 'marca', width: 150, responsive: 1 },
    { title: 'Descripción', field: 'descripcion', width: 350, responsive: 2 },
    { title: 'Precio', field: 'precio', width: 100, responsive: 2 },
    { title: 'Stock', field: 'stock', width: 100, responsive: 2 },
    { title: 'Tiempo de Creación', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setIsPopupOpen(true);
  };

  const handleDeleteClick = () => {
    if (inventoryItem && inventoryItem.id_item) {
      handleDelete([inventoryItem]);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Inventario</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID Artículo'} />
            <button onClick={handleUpdateClick} disabled={!inventoryItem.id_item}>
              {inventoryItem.id_item ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            <button className="delete-inventory-button" onClick={handleDeleteClick} disabled={!inventoryItem.id_item}>
              {inventoryItem.id_item ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            <button onClick={() => { setInventoryItem({}); setIsPopupOpen(true); }}>
              +
            </button>
          </div>
        </div>
        <Table
          data={inventoryItems}
          columns={columns}
          filter={filterId}
          dataToFilter="id_item"
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <Popup
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={inventoryItem}
        action={inventoryItem && inventoryItem.id_item ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default Inventory;
