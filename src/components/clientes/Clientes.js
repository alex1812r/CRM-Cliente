import React, { useEffect, useState, Fragment, useContext } from 'react';
import { CRMContext } from '../../context/CRMContext';
import { Link } from 'react-router-dom';
import AXIOS from '../../config/axios';
import alertify from 'alertifyjs';

// COMPONENTES
import Cliente from './Cliente';
import Spinner from '../layout/Spinner';

const Clientes = () => {

  const [clientes, guardarClientes] = useState([]);
  const [cargando, cambiarCargando] = useState(true);
  const [auth] = useContext(CRMContext);

  const eliminarCliente = id => {
    alertify.confirm(
      '¿Estas Seguro?', 
      'Un cliente Eliminado no se puede recuperar',
      () => {
        AXIOS.delete(`/clientes/${id}`, 
          { headers: { Authorization: `Baerer ${auth.token}` } }
        )
          .then(respuesta => {
            if(respuesta.data.Ok) {
              alertify.success(respuesta.data.mensaje);
              const clientesFiltrado = clientes.filter(cliente => cliente._id !== id);
              guardarClientes(clientesFiltrado);
            }else
              alertify.error(respuesta.data.mensaje);
          });
      },
      () => {}
    );
  }

  useEffect(() => {
    const consultarClientes = () => {
       AXIOS.get('/clientes',
        { headers: { Authorization: `Baerer ${auth.token}` } }
       )
        .then(respuesta => {
          if(respuesta.data.Ok)
            guardarClientes(respuesta.data.clientes);
          else
            alertify.error(respuesta.data.mensaje);

          cambiarCargando(false);
        })
        .catch(error => {
          alertify.error('Error al Consultar Clientes');
          cambiarCargando(false);
          console.log('error', error);
        });
    }

    consultarClientes();
  }, [auth]);
  

  let contenido = (
    <Spinner fullWidth />
  )

  if(!cargando)
    contenido = (
      <ul className="listado-clientes">
        {
          clientes.length ? 
            clientes.map(cliente => (
              <Cliente 
                key={cliente._id}
                cliente={cliente}
                eliminarCliente={eliminarCliente}
              />
            ))
          : <p style={{ textAlign: 'center' }}>
              No hay clientes registrados
            </p>
        }
      </ul>
    );

  return (
    <Fragment>
      <h2>Clientes</h2>
      <Link to="/clientes/nuevo" className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i> Nuevo Cliente
      </Link>

      { contenido }

    </Fragment>
  );
}
 
export default Clientes;
