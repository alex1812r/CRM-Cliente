import React from 'react';
import { Link } from 'react-router-dom';

const DetallesPedido = ({ pedido, eliminarPedido }) => {
  const { cliente } = pedido;
  return (
    <li className="pedido">
      <div className="info-pedido">
        <p className="id">ID: { pedido._id }</p>
        <p className="nombre">Cliente: { cliente.nombre } { cliente.apellido }</p>
        <div className="articulos-pedido">
          <p className="productos">Artículos Pedido: </p>
          <ul>
            {
              pedido.pedido.map(articulos => (
                <li key={`${pedido._id}${articulos.producto._id}`}>
                  <p>{ articulos.producto.nombre }</p>
                  <p>Precio: BsF { articulos.producto.precio }</p>
                  <p>Cantidad: { articulos.cantidad }</p>
                </li>
              ))
            }
          </ul>
        </div>
        <p className="total">Total: BsF { pedido.total } </p>
      </div>
      <div className="acciones">
        <Link to={`/pedidos/editar/${pedido._id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i> Editar Pedido
        </Link>
        <button 
          type="button" 
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarPedido(pedido._id)}>
          <i className="fas fa-times"></i> Eliminar Pedido
        </button>
      </div>
    </li>
  );
}
 
export default DetallesPedido;
