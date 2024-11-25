import React, { useState, useEffect } from "react";
import { createOrder } from "../services/order.service";

const PopupOrder = ({ isOpen, onClose, orderId, onOrderCreated }) => {
  const [formData, setFormData] = useState({
    client: "",
    problem: "",
    service: "",
    technician: "",
    products: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createOrder(formData);
    onOrderCreated(); // Llama a una función para actualizar el estado del padre
    onClose(); // Cierra el popup
  };

  useEffect(() => {
    if (orderId) {
      // Aquí cargarías los detalles de la orden si se edita una existente
      fetch(`/api/orders/${orderId}`).then((res) => res.json()).then(setFormData);
    }
  }, [orderId]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Crear/Editar Orden</h2>
        <form onSubmit={handleSubmit}>
          <label>Cliente:</label>
          <input
            type="text"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          />
          
          <label>Descripción del Problema:</label>
          <textarea
            value={formData.problem}
            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
          />

          <label>Servicio:</label>
          <select
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          >
            <option value="repair">Reparación</option>
            <option value="maintenance">Mantenimiento</option>
          </select>

          <label>Técnico:</label>
          <input
            type="text"
            value={formData.technician}
            onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
          />

          <button type="submit">Guardar Orden</button>
        </form>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default PopupOrder;
