import React, { Fragment, useEffect, useState, useCallback, useContext } from 'react';
import { CRMContext } from '../../context/CRMContext';
import { useParams, useHistory } from 'react-router-dom';
import AXIOS from '../../config/axios';
import alertify from 'alertifyjs';
import Spinner from '../layout/Spinner';

import FormBuscarProducto from './FormBuscarProducto';
import FormCantidadProducto from './FormCantidadProducto';
import FormBuscarCliente from './FormBuscarCliente';

const EditarPedido = () => {
  const [idCliente, guardarIdCliente] = useState('');
  const [cliente, guardarCliente] = useState({});
  const [busqueda, guardarBusqueda] = useState('');
  const [productos, guardarProductos] = useState([]);
  const [total, guardarTotal] = useState(0);
  const [cargando, cambiarCargando] = useState(true);
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

  const buscarCliente = () => {
    AXIOS.get(`/clientes/${idCliente}` ,
      { headers: { Authorization: `Baerer ${auth.token}` } })
      .then(respuesta => {
        if(respuesta.data.Ok)
          guardarCliente(respuesta.data.cliente);
        else
          alertify.error(respuesta.data.mensaje);
      })
      .catch(error => {
        console.log(error);
        alertify.error('Error al Consultar Cliente');
      })
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

  const actualizarPedido = event => {
    event.preventDefault();
    const pedido = {
      cliente: cliente._id,
      pedido: productos,
      total
    }
    AXIOS.put(`/pedidos/${id}`, pedido,
      { headers: { Authorization: `Baerer ${auth.token}` } })
      .then(respuesta => {
        if(respuesta.data.Ok) {
          alertify.success('El Pedido se ha Actualizado');
          history.push('/pedidos');
        }else
          alertify.error(respuesta.data.mensaje);
      })
      .catch(error => {
        alertify.error('Error al Actualizar Pedido');
      });
  }

  useEffect(() => actualizarTotal(), [actualizarTotal, productos]);

  useEffect(() => {
    const buscarPedido = () => {
      AXIOS.get(`/pedidos/${id}`,
        { headers: { Authorization: `Baerer ${auth.token}` } })
        .then(respuesta => {
          if(respuesta.data.Ok) {
            const { cliente, pedido } = respuesta.data.pedido;
            guardarCliente(cliente);
            let pedidoProductos = []; 
            pedido.forEach(articulo => {
              let articuloProducto = {...articulo.producto};
              articuloProducto.producto = articulo.producto._id;
              articuloProducto.cantidad = articulo.cantidad;
              pedidoProductos.push(articuloProducto);
            });
            guardarProductos(pedidoProductos);
          }else {
            alertify.error(respuesta.data.mensaje);
            history.push('/pedidos');
          }
          cambiarCargando(false);
        })
        .catch(error => {
          alertify.error('Error al Consultar Pedido');
          history.push('/pedidos');
        })
    }
    buscarPedido();
  }, [id, history, auth]);

  if(cargando)
    return (
      <Fragment>
        <h2>Editar Pedido</h2>
        <Spinner fullWidth />
      </Fragment>
    )
  
  return (
    <Fragment>
      <h2>Editar Pedido</h2>
      
      <FormBuscarCliente 
        leerIdCliente={(value) => guardarIdCliente(value)}
        idCliente={idCliente}
        buscarCliente={buscarCliente}
      />

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
          <form onSubmit={actualizarPedido}>
            <input 
              type="submit" 
              className="btn btn-block btn-verde" 
              value="Guardar cambios"
            />
          </form>
        : null
      }
    </Fragment>
  );
}
 
export default EditarPedido;
