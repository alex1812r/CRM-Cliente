import React, { Fragment, useState, useEffect, useContext } from 'react';
import { CRMContext } from '../../context/CRMContext';
import { useHistory, useParams } from 'react-router-dom';
import AXIOS from '../../config/axios';
import alertify from 'alertifyjs';
import Spinner from '../layout/Spinner';

const productoInitialState = { nombre: '', precio: '', imagen: '' };

const EditarProduto = () => {
  const [producto, guardarProducto] = useState(productoInitialState);
  const [archivo, guardarArchivo] = useState(null);
  const [enviando, cambiarEnviando] = useState(false);
  const [cargando, cambiarCargando] = useState(true);
  const [auth] = useContext(CRMContext);

  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const buscarProducto = () => {
      AXIOS.get(`/productos/${id}`, 
        { headers: { Authorization: `Baerer ${auth.token}` } })
        .then(respuesta => {
          if(respuesta.data.Ok)
            guardarProducto(respuesta.data.producto);
          else {
            alertify.error(respuesta.data.mensaje);
            history.push('/productos');
          }

          cambiarCargando(false);
        })
        .catch(error => {
          alertify.error('Error al buscar Producto');
          history.push('/productos');
          cambiarCargando(false);
        })
    }
    buscarProducto();
  }, [id, history, auth]);

  const actualizarState = event => {
    event.preventDefault();
    const { name, value } = event.target;
    guardarProducto({
      ...producto,
      [name]: value
    })
  }

  const leerArchivo = event => {
   const { files } = event.target;
    if(files.length)
      guardarArchivo(files[0]);
  }

  const actualizarProducto = event => {
    event.preventDefault();
    cambiarEnviando(true);

    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('imagen', archivo);

    AXIOS.put(`/productos/${id}`, formData, {
      headers: { 
        'Content-Type' : 'multipart/form-data',
        Authorization: `Baerer ${auth.token}`
      }
    })
      .then(respuesta => {
        if(respuesta.data.Ok)
          alertify.success('Cambios guardados con exito!');
          // history.push('/productos');
        else
          alertify.error(respuesta.data.mensaje);

        cambiarEnviando(false);
        history.push('/productos');
      })
      .catch(error => { 
        alertify.error('Error al Editar Producto');
        cambiarEnviando(false);
      });
  }

  let textoBoton = 'Guardar';
  if(enviando)
    textoBoton = <> <Spinner /> Guardando... </>;

  let imagen = null;
  if(producto.imagen)
    imagen = (
      <img 
        src={`${process.env.REACT_APP_BACKEND_URL}/${producto.imagen}`} 
        alt="producto-imagen" 
        width="300px"
      />
    );

  let contenido = <Spinner fullWidth />
  if(!cargando)
    contenido = (
      <form action="/productos" method="POST" onSubmit={actualizarProducto}>
        <legend>Llena todos los campos</legend>
        <div className="campo">
          <label>Nombre:</label>
          <input 
            type="text"
            placeholder="Nombre Producto" 
            name="nombre" 
            onChange={actualizarState}
            value={producto.nombre}
          />
        </div>
        <div className="campo">
          <label>Precio:</label>
          <input 
            type="number"
            name="precio" 
            min="0.00"
            step="0.01"
            placeholder="Precio"
            onChange={actualizarState}
            value={producto.precio}
          />
        </div>
        <div className="campo">
          <label>Imagen:</label>
          { imagen }
          <input 
            type="file"
            name="imagen"
            onChange={leerArchivo}
          />
        </div>
        <div className="enviar">
          <button 
            type="submit" 
            className="btn btn-azul"  
            disabled={enviando}>
              { textoBoton }
          </button>
        </div>
      </form>
    );

  return (
    <Fragment>
      <h2>Editar Producto</h2>
      
      { contenido }

    </Fragment>
  );
}
 
export default EditarProduto;
