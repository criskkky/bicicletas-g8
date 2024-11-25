import Table from '@components/Table';
import useMaintenances from '@hooks/maintenances/useGetMaintenances.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupMaintenance';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/maintenances.css';
import useEditMaintenance from '@hooks/maintenances/useEditMaintenance';
import useDeleteMaintenance from '@hooks/maintenances/useDeleteMaintenance';
import useCreateMaintenance from '@hooks/maintenances/useCreateMaintenance';

const Maintenance = () => {
  const { maintenances, fetchMaintenances, setMaintenances } = useMaintenances();
  const [filterId, setFilterId] = useState('');

  const {
    handleUpdate,
    dataMaintenance,
    setDataMaintenance,
  } = useEditMaintenance(setMaintenances);

  const { handleDelete } = useDeleteMaintenance(fetchMaintenances, setDataMaintenance);
  const { handleCreate } = useCreateMaintenance(setMaintenances); // Manejo de creación
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar el popup

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  // Maneja los mantenimientos seleccionados desde la tabla
  const handleSelectionChange = useCallback(
    (selectedMaintenances) => {
      setDataMaintenance(selectedMaintenances.length > 0 ? selectedMaintenances[0] : {}); // Selecciona solo el primero
    },
    [setDataMaintenance]
  );

  const columns = [
    { title: 'ID MNT', field: 'id', width: 100, responsive: 0 },
    { title: 'Descripción', field: 'description', width: 350, responsive: 4 },
    { title: 'Técnico Asignado', field: 'technician', width: 300, responsive: 3 },
    { title: 'Estado', field: 'status', width: 150, responsive: 0 },
    { title: 'Fecha', field: 'date', width: 200, responsive: 0 },
    {
      title: 'ID(s) de artículo(s) usado(s)', 
      field: 'inventoryItems', 
      width: 300, 
      responsive: 3,
      render: rowData => (
        rowData.inventoryItems && rowData.inventoryItems.length > 0 && (
          rowData.inventoryItems.map(item => (
            <div key={item.idUsedItem}>
              {`ID: ${item.idUsedItem}, Cantidad: ${item.quantityUsed}`}
            </div>
          ))
        )
      )
    },
    { title: 'Creado', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setShowPopup(true); // Abre el popup en modo edición
  };

  const handleDeleteClick = () => {
    if (dataMaintenance && dataMaintenance.id) {
      handleDelete([dataMaintenance]); // Llama al handler de eliminación solo si 'dataMaintenance' tiene un ID
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Mantenimientos</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID'} />
            {/* Botón de editar */}
            <button onClick={handleUpdateClick} disabled={!dataMaintenance.id}>
              {dataMaintenance.id ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            {/* Botón de eliminar */}
            <button className="delete-maintenance-button" onClick={handleDeleteClick} disabled={!dataMaintenance.id}>
              {dataMaintenance.id ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            {/* Botón de crear */}
            <button onClick={() => { setDataMaintenance({}); setShowPopup(true); }}>
              +
            </button>
          </div>
        </div>
        <Table
          data={maintenances}
          columns={columns}
          filter={filterId}
          dataToFilter="id"
          onSelectionChange={handleSelectionChange} // Actualiza la selección según selección en la tabla
        />
      </div>

      {/* Popup para crear o editar mantenimientos */}
      <Popup
        show={showPopup}
        setShow={setShowPopup}
        data={dataMaintenance}
        action={dataMaintenance.id ? handleUpdate : handleCreate} // Crear o actualizar
      />
    </div>
  );
};

export default Maintenance;
