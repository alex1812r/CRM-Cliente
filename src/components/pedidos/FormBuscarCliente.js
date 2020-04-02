import React from 'react';

const FormBuscarCliente = ({ idCliente, leerIdCliente, buscarCliente }) => {

  const onChange = event => {
    const { value } = event.target;
    leerIdCliente(value);
  }

  const onSubmit = event => {
    event.preventDefault();
    buscarCliente();
  }

  return (
    <form style={{ marginBottom: '4rem' }} onSubmit={onSubmit}>
      <legend>Busca y cambia el Cliente del pedido</legend>

      <div className="campo">
        <label>Cliente: </label>
        <input 
          type="text" 
          value={idCliente || ''}
          placeholder="ID del Cliente"
          onChange={onChange}
        />

      </div>

      <button
        type="submit" 
        className="btn btn-azul btn-block">
        Buscar Cliente
      </button>
    </form>
  );
}
 
export default FormBuscarCliente;
