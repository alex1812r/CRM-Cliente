import React, { Fragment, useState, useEffect, useContext } from 'react';
import { CRMContext } from '../../context/CRMContext';
import { Link } from 'react-router-dom';
import AXIOS from '../../config/axios';
import alertify from 'alertifyjs';
import Producto from './Producto';
import Spinner from '../layout/Spinner';

const Productos = () => {
  const [productos, guardarProductos] = useState([]);
  const [cargando, cambiarCargando] = useState(true);
  const [auth] = useContext(CRMContext);

  const eliminarProducto = id => {
    alertify.confirm(
      '¿Estas Seguro?',
      'Un Producto eliminado no se puede recuperar',
      () => {
        AXIOS.delete(`/productos/${id}`,
          { headers: { Authorization: `Baerer ${auth.token}` } })
          .then(respuesta => {
            if(respuesta.data.Ok) {
              const productosFiltrado = productos.filter(producto => producto._id !== id);
              guardarProductos(productosFiltrado);
              alertify.success(respuesta.data.mensaje);
            }else
              alertify.error(respuesta.data.mensaje);
          })
          .catch(error => alertify.error('Error al Eliminar Producto'))
      },
      () => {}
    );
  }

  useEffect(() => {
    const consultarProductos = () => {
      AXIOS.get('/productos', 
        { headers: { Authorization: `Baerer ${auth.token}` } })
        .then(respuesta => {
          if(respuesta.data.Ok)
            guardarProductos(respuesta.data.productos);
          else
            alertify.error(respuesta.data.mensaje);

          cambiarCargando(false);
        })
        .catch(error => {
          alertify.error('Error al Consultar Productos');
          cambiarCargando(false);
        });
    }
    
    consultarProductos();
  }, [auth]);

  let contenido = (
    <Spinner fullWidth />
  )

  if(!cargando) 
    contenido = 
      <ul className="listado-productos">
        {
          productos.length ?
            productos.map(producto => (
              <Producto
                key={producto._id}
                producto={producto}
                eliminarProducto={eliminarProducto}
              />
            ))
          : <p style={{ textAlign: 'center' }}>
              No hay productos, registra uno!
            </p>
        }
      </ul>

  return (
    <Fragment>
      <h2>Productos</h2>
      <Link to="/productos/nuevo" className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i> Nuevo Producto
      </Link>
    
      { contenido }

    </Fragment>
  );
}
 
export default Productos;
