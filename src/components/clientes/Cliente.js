import React from 'react';
import { Link } from 'react-router-dom';

const Cliente = ({ cliente, eliminarCliente }) => {
  
  return (
    <li className="cliente">
      <div className="info-cliente">
        <p className="nombre">{ cliente.nombre } { cliente.apellido }</p>
        <p className="empresa">{ cliente.empresa }</p>
        <p>ID: { cliente._id }</p>
        <p>{ cliente.email }</p>
        <p>Tel: { cliente.telefono }</p>
      </div>
      <div className="acciones">
        <Link to={`/clientes/editar/${cliente._id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Cliente
        </Link>
        <Link to={`/pedidos/nuevo/${cliente._id}`} className="btn btn-amarillo">
          <i className="fas fa-plus"></i>
          Nuevo Pedido
        </Link>
        <button 
          type="button" 
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarCliente(cliente._id)}>
          <i className="fas fa-times"></i>
          Eliminar Cliente
        </button>
      </div>
    </li>
  );
};
 
export default Cliente;
