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
import useInventory from '@hooks/inventario/useGetInventory';

const Maintenance = () => {
  const { maintenances, fetchMaintenances, setMaintenances } = useMaintenances();
  const [filterType, setFilterType] = useState('id_mantenimiento'); // Tipo de filtro por defecto
  const [filterValue, setFilterValue] = useState(''); // Valor del filtro
  const { inventory } = useInventory();

  const {
    handleUpdate,
    dataMaintenance,
    setDataMaintenance,
    isPopupOpen,
    setIsPopupOpen,
  } = useEditMaintenance(fetchMaintenances, setMaintenances);

  const { handleDelete } = useDeleteMaintenance(fetchMaintenances, setDataMaintenance);
  const { handleCreate } = useCreateMaintenance(fetchMaintenances, setMaintenances);

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setFilterValue(''); // Limpiamos el valor cuando cambiamos el filtro
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedMaintenances) => {
      setDataMaintenance(selectedMaintenances.length > 0 ? selectedMaintenances[0] : {});
    },
    [setDataMaintenance]
  );

  const columns = [
    { title: 'ID MNT', field: 'id_mantenimiento', width: 100, responsive: 0 },
    { title: 'Técnico (RUT)', field: 'rut_trabajador', width: 100, responsive: 1 },
    { title: 'Cliente (RUT)', field: 'rut_cliente', width: 100, responsive: 1 },
    { title: 'Descripción', field: 'descripcion', width: 350, responsive: 3 },
    { title: 'Fecha MNT', field: 'fecha_mantenimiento', width: 150, responsive: 2 },
    {
      title: 'Artículos Usados',
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
    { title: 'Tiempo de Creación', field: 'createdAt', width: 200, responsive: 0 },
    { title: 'Última Actualización', field: 'updatedAt', width: 200, responsive: 0 },
  ];

  const handleUpdateClick = () => {
    setIsPopupOpen(true);
  };

  const handleDeleteClick = () => {
    if (dataMaintenance && dataMaintenance.id_mantenimiento) {
      handleDelete([dataMaintenance]);
    }
  };

  // Filtro aplicado segun tipo y valor
  const filteredMaintenances = maintenances.filter(maintenance => {
    switch (filterType) {
      case 'rut_trabajador':
        return maintenance.rut_trabajador.includes(filterValue);
      case 'rut_cliente':
        return maintenance.rut_cliente.includes(filterValue);
      case 'id_mantenimiento':
        return maintenance.id_mantenimiento.toString().includes(filterValue);
      case 'fecha_mantenimiento':
        return maintenance.fecha_mantenimiento.includes(filterValue);
      default:
        return true;
    }
  });

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Mantenimientos</h1>
          <div className="filter-actions">
            <select onChange={handleFilterTypeChange} value={filterType}>
              <option value="id_mantenimiento">ID Mantenimiento</option>
              <option value="rut_trabajador">Técnico (RUT)</option>
              <option value="rut_cliente">Cliente (RUT)</option>
              <option value="fecha_mantenimiento">Fecha</option>
            </select>
            <input
              type="text"
              placeholder={`Filtrar por ${filterType === 'id_mantenimiento' ? 'ID MNT' : filterType === 'rut_trabajador' ? 'RUT Técnico' : filterType === 'rut_cliente' ? 'RUT Cliente' : 'Fecha'}`}
              value={filterValue}
              onChange={handleFilterValueChange}
            />
            <button onClick={handleUpdateClick} disabled={!dataMaintenance.id_mantenimiento}>
              {dataMaintenance.id_mantenimiento ? (
                <img src={UpdateIcon} alt="edit" />
              ) : (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              )}
            </button>
            <button className="delete-maintenance-button" onClick={handleDeleteClick} disabled={!dataMaintenance.id_mantenimiento}>
              {dataMaintenance.id_mantenimiento ? (
                <img src={DeleteIcon} alt="delete" />
              ) : (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              )}
            </button>
            <button onClick={() => { setDataMaintenance({}); setIsPopupOpen(true); }} disabled={dataMaintenance.id_mantenimiento}>
              +
            </button>
          </div>
        </div>
        <Table
          data={filteredMaintenances} // Usamos los mantenimientos filtrados
          columns={columns}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <Popup
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={dataMaintenance}
        action={dataMaintenance && dataMaintenance.id_mantenimiento ? handleUpdate : handleCreate}
        inventory={inventory}
      />
    </div>
  );
};

export default Maintenance;
