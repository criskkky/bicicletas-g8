import Table from '@components/Table';
import useMaintenances from '@hooks/mantenimiento/useGetMaintenances.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupMaintenance';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/maintenances.css';
import useEditMaintenance from '@hooks/mantenimiento/useEditMaintenance';
import useDeleteMaintenance from '@hooks/mantenimiento/useDeleteMaintenance';
import useCreateMaintenance from '@hooks/mantenimiento/useCreateMaintenance';

const Maintenance = () => {
  const { maintenances, fetchMaintenances, setMaintenances } = useMaintenances();
  const [filterId, setFilterId] = useState('');

  const {
    handleUpdate,
    dataMaintenance,
    setDataMaintenance,
  } = useEditMaintenance(setMaintenances);

  const { handleDelete } = useDeleteMaintenance(fetchMaintenances, setDataMaintenance);
  const { handleCreate } = useCreateMaintenance(setMaintenances);
  const [showPopup, setShowPopup] = useState(false);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedMaintenances) => {
      setDataMaintenance(selectedMaintenances.length > 0 ? selectedMaintenances[0] : {});
    },
    [setDataMaintenance]
  );

  const columns = [
    { title: 'ID Mantenimiento', field: 'id_mantenimiento', width: 100, responsive: 0 },
    { title: 'Técnico (RUT)', field: 'rut_trabajador', width: 300, responsive: 1 },
    { title: 'Cliente (RUT)', field: 'rut_cliente', width: 300, responsive: 1 },
    { title: 'Descripción', field: 'descripcion', width: 350, responsive: 4 },
    { title: 'Fecha Mantenimiento', field: 'fecha_mantenimiento', width: 200, responsive: 1 },
    {
      title: 'Artículos Usados',
      field: 'items', // Ajuste para reflejar el campo correcto
      width: 300,
      responsive: 3,
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
    { title: 'Creado', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setShowPopup(true);
  };

  const handleDeleteClick = () => {
    if (dataMaintenance && dataMaintenance.id_mantenimiento) {
      handleDelete([dataMaintenance]);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Mantenimientos</h1>
          <div className="filter-actions">
            <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID de Mantenimiento'} />
            {/* Botón de editar */}
            <button onClick={handleUpdateClick} disabled={!dataMaintenance.id_mantenimiento}>
              {dataMaintenance.id_mantenimiento ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            {/* Botón de eliminar */}
            <button className="delete-maintenance-button" onClick={handleDeleteClick} disabled={!dataMaintenance.id_mantenimiento}>
              {dataMaintenance.id_mantenimiento ? (
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
          dataToFilter="id_mantenimiento"
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* Popup para crear o editar mantenimientos */}
      <Popup
        show={showPopup}
        setShow={setShowPopup}
        data={dataMaintenance}
        action={dataMaintenance.id_mantenimiento ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default Maintenance;
