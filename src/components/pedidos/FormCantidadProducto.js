import React from 'react';

const FormCantidadProducto = (props) => {
  const { 
    index, 
    producto, 
    aumentarProducto, 
    disminuirProducto,
    eliminarProductoPedido
  } = props;
  return (
    <li>
      <div className="texto-producto">
        <p className="nombre">{ producto.nombre }</p>
        <p className="precio">BsF { producto.precio }</p>
      </div>
      <div className="acciones">
        <div className="contenedor-cantidad">
          <i 
            className="fas fa-minus"
            onClick={() => disminuirProducto(index)}
          ></i>
          <p>{ producto.cantidad }</p>
          <i 
            className="fas fa-plus"
            onClick={() => aumentarProducto(index)}
          ></i>
        </div>
        <button 
          type="button" 
          className="btn btn-rojo" 
          onClick={() => eliminarProductoPedido(producto._id)}>
          <i className="fas fa-minus-circle"></i> Eliminar Producto
        </button>
      </div>
    </li>
  );
}
 
export default FormCantidadProducto;
