import React, { Fragment, useState, useEffect, useCallback, useContext } from 'react';
import { CRMContext } from '../../context/CRMContext';
import { useParams, useHistory } from 'react-router-dom';
import AXIOS from '../../config/axios';
import alertify from 'alertifyjs';

import FormBuscarProducto from './FormBuscarProducto';
import FormCantidadProducto from './FormCantidadProducto';

const NuevoPedido = () => {
  const [cliente, guardarCliente] = useState({});
  const [busqueda, guardarBusqueda] = useState('');
  const [productos, guardarProductos] = useState([]);
  const [total, guardarTotal] = useState(0);
  const [auth] = useContext(CRMContext);

  const history = useHistory();
  const { id } = useParams();

  const buscarProducto = () => {
    const url = `/productos/buscar?busqueda=${busqueda}`;
    AXIOS.get(url, { headers: { Authorization: `Baerer ${auth.token}` } })
      .then(respuesta => {
        if(respuesta.data.Ok) {
          if(respuesta.data.productos.length) {
            let nuevoProducto = respuesta.data.productos[0];
            nuevoProducto.producto = respuesta.data.productos[0]._id;
            nuevoProducto.cantidad = 1;
            guardarProductos([...productos, nuevoProducto]);
          } else
            alertify.error('No hubo resultados en la busqueda');
        }else
          alertify.error('Error al Buscar Producto');
      })
      .catch(error => {
        alertify.error('Error al Buscar Producto');
      });
  }

  const actualizarTotal = useCallback(() => {
    if(!productos.length) {
      guardarTotal(0);
      return;
    }
    let nuevoTotal = 0;
    productos.forEach(producto => {
      nuevoTotal += producto.cantidad * producto.precio
    })
    guardarTotal(nuevoTotal);
  }, [productos]);

  const aumentarProducto = index => {
    let productosCopia = [...productos];
    productosCopia[index].cantidad++;
    guardarProductos(productosCopia);
    actualizarTotal();
  }

  const disminuirProducto = index => {
    let productosCopia = [...productos];
    if(productosCopia[index].cantidad <= 1) return;
    productosCopia[index].cantidad--;
    guardarProductos(productosCopia);
    actualizarTotal();
  }

  const eliminarProductoPedido = id => {
    const prouctosFiltrados = productos.filter(producto => producto._id !== id);
    guardarProductos(prouctosFiltrados);
  }

  const realizarPedido = event => {
    event.preventDefault();
    const pedido = {
      cliente: id,
      pedido: productos,
      total
    }
    AXIOS.post(`/pedidos`, pedido,
      { headers: { Authorization: `Baerer ${auth.token}` } })
      .then(respuesta => {
        if(respuesta.data.Ok) {
          alertify.success(respuesta.data.mensaje);
          history.push('/pedidos');
        }else
          alertify.error(respuesta.data.mensaje);
      })
      .catch(error => {
        alertify.error('Error al Realizar Pedido');
      });
  }

  useEffect(() => actualizarTotal(), [actualizarTotal, productos]);

  useEffect(() => {
    const buscarCliente = () => {
      AXIOS.get(`/clientes/${id}`, 
        { headers: { Authorization: `Baerer ${auth.token}` } })
        .then(respuesta => {
          if(respuesta.data.Ok)
            guardarCliente(respuesta.data.cliente);
          else {
            alertify.error(respuesta.data.mensaje);
            history.push('/');
          }
        })
        .catch(error => {
          alertify.error('Error al buscar Cliente');
          history.push('/');
        });
    }
    buscarCliente();
  }, [id, history, auth]);

  return (
    <Fragment>
      <h2>Nuevo Pedido</h2>
      
      <div className="ficha-cliente">
        <h3>Datos Cliente</h3>
        <p>ID: { cliente._id }</p>
        <p>Nombre: { cliente.nombre }</p>
        <p>Teléfono: { cliente.telefono }</p>
      </div>

      <FormBuscarProducto 
        buscarProducto={buscarProducto}
        leerDatosBusqueda={(value) => guardarBusqueda(value)}
        busqueda={busqueda}
      />

      <ul className="resumen">
        { 
          productos.map((producto, index) => (
            <FormCantidadProducto 
              key={producto.producto}
              index={index}
              producto={producto}
              aumentarProducto={aumentarProducto}
              disminuirProducto={disminuirProducto}
              eliminarProductoPedido={eliminarProductoPedido}
            />
          )) 
        }
      </ul>

      <p className="total">Total a Pagar: <span>BsF { total }</span></p>
      {
        total > 0 ?
          <form onSubmit={realizarPedido}>
            <input 
              type="submit" 
              className="btn btn-block btn-verde" 
              value="Realizar Pedido" 
            />
          </form>
        : null
      }
    </Fragment>
  );
}
 
export default NuevoPedido;
