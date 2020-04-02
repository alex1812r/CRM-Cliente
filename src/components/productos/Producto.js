import React from 'react';
import { Link } from 'react-router-dom';

const Producto = ({ producto, eliminarProducto }) => {

  let imagen = producto.imagen
    ? <img src={`http://localhost:5000/${producto.imagen}`} alt="producto-imagen"/> 
    : null

  return (
    <li className="producto">
      <div className="info-producto">
        <p className="nombre">{ producto.nombre }</p>
        <p className="precio">BsF { producto.precio }</p>
        { imagen }
      </div>
      <div className="acciones">
        <Link to={`/productos/editar/${producto._id}`} className="btn btn-azul">
            <i className="fas fa-pen-alt"></i> Editar Producto
        </Link>
        <button 
          type="button" 
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarProducto(producto._id)}>
            <i className="fas fa-times"></i> Eliminar Cliente
        </button>
      </div>
    </li>
  );
}
 
export default Producto;
