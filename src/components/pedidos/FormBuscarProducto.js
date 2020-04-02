import React from 'react';

const FormBuscarProducto = ({ buscarProducto, leerDatosBusqueda, busqueda }) => {

  const onSubmit = event => {
    event.preventDefault();
    buscarProducto();
  }

  const onChange = event => {
    const { value } = event.target;
    leerDatosBusqueda(value)
  }

  return (
    <form action="/productos" method="POST" onSubmit={onSubmit}>
      <legend>Busca un Producto y agrega una cantidad</legend>
      
      <div className="campo">
        <label>Productos:</label>
        <input 
          type="text" 
          placeholder="Nombre Productos" 
          name="productos"
          onChange={onChange}
          value={busqueda}
        />
      </div>

      <button 
        type="submit"
        className="btn btn-azul btn-block">
          Buscar Producto
      </button>
    </form>
  );
}
 
export default FormBuscarProducto;
