import React, { Fragment, useState, useContext } from 'react';
import { CRMContext } from '../../context/CRMContext';
import AXIOS from '../../config/axios';
import alertify from 'alertifyjs';
import { useParams, useHistory } from 'react-router-dom';
import { useEffect } from 'react';

const clienteInitialState = {
  nombre: '',
  apellido: '',
  empresa: '',
  email: '',
  telefono: ''
}

const EditarCliente = () => {
  const { id } = useParams();
  const history = useHistory();

  const [cliente, guardarCliente] = useState(clienteInitialState);
  const [auth] = useContext(CRMContext);

  const actualizarState = event => {
    event.preventDefault();
    const { name, value } = event.target;
    guardarCliente({
      ...cliente,
      [name]: value
    });
  }

  useEffect(() => {
    const buscarCliente = async () => {
      try{
        const respuesta = await AXIOS.get(`/clientes/${id}`, 
        { headers: { Authorization: `Baerer ${auth.token}` } });
        if(respuesta.data.Ok)
          guardarCliente(respuesta.data.cliente);
        else {
          alertify.error(respuesta.data.mensaje);
          history.push('/');
        }
      }catch(error) {
        alertify.error('Error al buscar Cliente');
        history.push('/');
      }
    }
    buscarCliente();
  }, [id, history, auth]);

  const validarCliente = () => {
    const { nombre, apellido, empresa, email, telefono } = cliente;
    const valido = !nombre.length || !apellido.length || !empresa.length || !email.length || !telefono.length
    return valido;
  }

  const actualizarCliente = event => {
    event.preventDefault();
    
    let clienteActualizado = {...cliente};
    delete clienteActualizado._id

    AXIOS.put(`/clientes/${id}`, clienteActualizado, 
      { headers: { Authorization: `Baerer ${auth.token}` } })
      .then(respuesta => {
        if(respuesta.data.Ok) {
          alertify.success('El Cliente se ha actualizado');
          history.push('/');
        } else {
          alertify.error(respuesta.data.mensaje);
        }
      });
   
  }

  return (
    <Fragment>
      <h2>Editar Cliente</h2>
      <form action="/clientes" method="PUT" onSubmit={actualizarCliente}>
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
          <input 
            type="submit" 
            className="btn btn-azul" 
            value="Editar Cliente"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </Fragment>
  );
}
 
export default EditarCliente;
