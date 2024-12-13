import Table from '@components/Table';
import useInventory from '@hooks/inventario/useGetInventory.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupInventory';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/inventory.css';
import useEditInventory from '@hooks/inventario/useEditInventory';
import useDeleteInventory from '@hooks/inventario/useDeleteInventory';
import useCreateInventory from '@hooks/inventario/useCreateInventory';

const Inventory = () => {
  const { inventory, fetchInventory, setInventory } = useInventory();
  const [filterId, setFilterId] = useState('');

  const {
    handleUpdate,
    dataInventory,
    setDataInventory,
    isPopupOpen,
    setIsPopupOpen,
  } = useEditInventory(fetchInventory, setInventory);

  const { handleDelete } = useDeleteInventory(fetchInventory, setDataInventory);
  const { handleCreate } = useCreateInventory(fetchInventory, setInventory);

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
    { title: 'ID', field: 'id_item', width: 100, responsive: 0 },
    { title: 'Nombre', field: 'nombre', width: 200, responsive: 1 },
    { title: 'Marca', field: 'marca', width: 150, responsive: 1 },
    { title: 'Descripción', field: 'descripcion', width: 350, responsive: 3 },
    { title: 'Precio', field: 'precio', width: 150, responsive: 2 },
    { title: 'Stock', field: 'stock', width: 100, responsive: 2 },
    { title: 'Tiempo de Creación', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setIsPopupOpen(true);
  };

  const handleDeleteClick = () => {
    if (dataInventory && dataInventory.id_item) {
      handleDelete([dataInventory]);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Inventario</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID'} />
            <button onClick={handleUpdateClick} disabled={!dataInventory.id_item}>
              {dataInventory.id_item ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            <button className="delete-inventory-button" onClick={handleDeleteClick} disabled={!dataInventory.id_item}>
              {dataInventory.id_item ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            <button onClick={() => { setDataInventory({}); setIsPopupOpen(true); }}>
              +
            </button>
          </div>
        </div>
        <Table
          data={inventory}
          columns={columns}
          filter={filterId}
          dataToFilter="id_item"
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <Popup
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={dataInventory}
        action={dataInventory && dataInventory.id_item ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default Inventory;
