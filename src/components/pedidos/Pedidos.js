import React, { useState, useEffect, Fragment, useContext } from 'react';
import { CRMContext } from '../../context/CRMContext';
import AXIOS from '../../config/axios';
import alertify from 'alertifyjs';
import Spinner from '../layout/Spinner';
import DetallesPedido from './DetallesPedido';

const Pedidos = () => {
  const [pedidos, guardarPedidos] = useState([]);
  const [cargando, cambiarCargando] = useState(true);
  const [auth] = useContext(CRMContext);

  const eliminarPedido = id => {
    alertify.confirm(
      '¿Estas Seguro?',
      'Un pedido Eliminado no se puede recuperar',
      () => {
        AXIOS.delete(`/pedidos/${id}`, 
          { headers: { Authorization: `Baerer ${auth.token}` } })
          .then(respuesta => {
            if(respuesta.data.Ok) {
              const pedidosFiltrado = pedidos.filter(pedido => pedido._id !== id);
              guardarPedidos(pedidosFiltrado);
              alertify.success(respuesta.data.mensaje);
            }else
              alertify.error(respuesta.data.mensaje);
          })
          .catch(error => {
            alertify.error('Error al Eliminar Pedido');
          });
      },
      () => {}
    );
  }

  useEffect(() => {
    const buscarPedidos = () => {
      AXIOS.get('/pedidos',
        { headers: { Authorization: `Baerer ${auth.token}` } })
        .then(respuesta => {
          if(respuesta.data.Ok) {
            guardarPedidos(respuesta.data.pedidos);
            cambiarCargando(false);
          }else 
            alertify.error(respuesta.data.mensaje);
        })
        .catch(error => {
          console.log(error);
          alertify.error('Error al Consultar Pedidos');
          cambiarCargando(false);
        })
    }
    buscarPedidos();
  }, [auth]);

  let contenido = <Spinner fullWidth />

  if(!cargando)
    contenido = (
      <Fragment>
        {
          pedidos.length ? 
            <ul className="listado-pedidos">
              {
                pedidos.map(pedido => (
                  <DetallesPedido 
                    key={pedido._id}
                    pedido={pedido}
                    eliminarPedido={eliminarPedido}
                  />
                ))
              }
            </ul>
          : <p style={{ textAlign: 'center' }}>
              No se han realizado pedidos aún
            </p>
        }
      </Fragment>
    )

  return (
    <Fragment>
      <h2>Pedidos</h2>
      { contenido }
    </Fragment>
  );
}
 
export default Pedidos;
