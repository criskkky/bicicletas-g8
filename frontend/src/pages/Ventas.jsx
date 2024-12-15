import jsPDF from "jspdf";
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
import useInventory from '@hooks/inventario/useGetInventory';

const Sales = () => {
  const { sales, fetchSales, setSales } = useSales();
  const [filterId, setFilterId] = useState('');
  const { inventory } = useInventory();

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
      setSales(prevSales => prevSales.filter(sale => sale.id_venta !== dataSale.id_venta));
      setDataSale({});
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(24);
    doc.text("Ventas - Reporte", 14, 10);
  
    doc.setFontSize(12);
    let yPosition = 20;
  
    sales.forEach((sale) => {
      console.log("Datos originales", sale.items);
  
      // Validación y transformación de `sale.items`
      if (typeof sale.items === "string") {
        const itemArray = sale.items.split(",").map((item) => item.trim());
        const processedItems = [];
  
        for (let i = 0; i < itemArray.length; i++) {
          const item = itemArray[i];
  
          // Procesa si es un ID
          if (item.startsWith("ID:")) {
            const id_item = item.replace("ID:", "").trim();
  
            // Verifica si el siguiente elemento es una cantidad
            if (i + 1 < itemArray.length && itemArray[i + 1].startsWith("Cantidad:")) {
              const cantidad = itemArray[i + 1].replace("Cantidad:", "").trim();
              processedItems.push({ id_item, cantidad });
              i++; // Salta al siguiente elemento ya procesado
            } else {
              console.warn(`Cantidad no encontrada para ID: ${id_item}`);
            }
          }
        }
  
        sale.items = processedItems;
      } else if (!Array.isArray(sale.items)) {
        console.warn("Formato inesperado en sale.items:", sale.items);
        sale.items = [];
      }
  
      // Renderización de datos en PDF
      doc.text(`ID Venta: ${sale.id_venta}`, 14, yPosition);
      yPosition += 10;
  
      doc.text(`Técnico (RUT): ${sale.rut_trabajador}`, 14, yPosition);
      yPosition += 10;
  
      doc.text(`Cliente (RUT): ${sale.rut_cliente}`, 14, yPosition);
      yPosition += 10;
  
      doc.text(`Fecha Venta: ${sale.fecha_venta}`, 14, yPosition);
      yPosition += 10;
  
      if (Array.isArray(sale.items) && sale.items.length > 0) {
        doc.text("Artículos Vendidos:", 14, yPosition);
        yPosition += 10;
  
        sale.items.forEach((item) => {
          if (item.id_item && item.cantidad) {
            doc.text(
              `ID Artículo: ${item.id_item}, Cantidad: ${item.cantidad}`,
              14,
              yPosition
            );
            yPosition += 10;
          } else {
            doc.text("Artículo inválido detectado.", 14, yPosition);
            yPosition += 10;
          }
        });
      } else {
        doc.text("No hay artículos disponibles", 14, yPosition);
        yPosition += 10;
      }
  
      doc.text(`Total Venta: ${sale.total}`, 14, yPosition);
      yPosition += 10;
  
      doc.text(`Tiempo de Creación: ${sale.createdAt}`, 14, yPosition);
      yPosition += 10;
  
      doc.text(`Última Actualización: ${sale.updatedAt}`, 14, yPosition);
      yPosition += 10;
  
      yPosition += 10;
  
      // Salto de página si el contenido supera el límite
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
  
    doc.save("ventas_report.pdf");
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
            <button onClick={downloadPDF}>Descargar PDF</button>
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
        inventory = {inventory}
      />
    </div>
  );
};

export default Sales;
