import React, { Fragment, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';
import AXIOS from '../../config/axios';
import alertify from 'alertifyjs'
import Spinner from '../layout/Spinner';

const clienteInitialState = {
  nombre: '',
  apellido: '',
  empresa: '',
  email: '',
  telefono: ''
}

const NuevoCliente = () => {

  const [cliente, guardarCliente] = useState(clienteInitialState);
  const [enviando, cambiarEnviando] = useState(false);
  const [auth] = useContext(CRMContext);

  const history = useHistory();

  const actualizarState = event => {
    event.preventDefault();
    const { name, value } = event.target;
    guardarCliente({
      ...cliente,
      [name]: value
    });
  }

  const validarCliente = () => {
    const { nombre, apellido, empresa, email, telefono } = cliente;
    const valido = !nombre.length || !apellido.length || !empresa.length || !email.length || !telefono.length
    return valido;
  }

  const agregarCliente = event => {
    event.preventDefault();
    cambiarEnviando(true);
    AXIOS.post('/clientes', cliente,
      { headers: { Authorization: `Baerer ${auth.token}` } })
      .then(respuesta => {
        if(respuesta.data.Ok) {
          alertify.success(respuesta.data.mensaje)
          guardarCliente(clienteInitialState);
          history.push('/');
        }else {
          alertify.error(respuesta.data.mensaje);
        }
        cambiarEnviando(false);
      });
  }

  let textoBoton = 'Agregar Cliente';
  if(enviando)
    textoBoton = <> <Spinner /> Guardando... </>;

  return (
    <Fragment>
      <h2>Nuevo Cliente</h2>
      <form action="/clientes" method="POST" onSubmit={agregarCliente}>
        <legend>Llena todos los campos</legend>
        <div className="campo">
          <label>Nombre:</label>
          <input 
            type="text" 
            placeholder="Nombre Cliente" 
            name="nombre"
            onChange={actualizarState}
            value={cliente.nombre}
          />
        </div>
        <div className="campo">
          <label>Apellido:</label>
          <input 
            type="text" 
            placeholder="Apellido Cliente" 
            name="apellido"
            onChange={actualizarState}
            value={cliente.apellido}
          />
        </div>
        <div className="campo">
          <label>Empresa:</label>
          <input 
            type="text" 
            placeholder="Empresa Cliente" 
            name="empresa"
            onChange={actualizarState}
            value={cliente.empresa}
          />
        </div>
        <div className="campo">
          <label>Email:</label>
          <input 
            type="email" 
            placeholder="Email Cliente" 
            name="email"
            onChange={actualizarState}
            value={cliente.email}
          />
        </div>
        <div className="campo">
          <label>Teléfono:</label>
          <input 
            type="tel" 
            placeholder="Teléfono Cliente" 
            name="telefono"
            onChange={actualizarState}
            value={cliente.telefono}
          />
        </div>
        <div className="enviar">
          <button 
            type="submit" 
            className="btn btn-azul" 
            disabled={validarCliente() || enviando}>
              { textoBoton }
          </button>
        </div>
      </form>
    </Fragment>
  );
}
 
export default NuevoCliente;
