import React, { Fragment, useState, useContext } from 'react';
import { CRMContext } from '../../context/CRMContext';
import { useHistory } from 'react-router-dom';
import AXIOS from '../../config/axios';
import alertify from 'alertifyjs';
import Spinner from '../layout/Spinner';

const productoInitialState = { nombre: '', precio: '' };

const NuevoProducto = () => {
  const [producto, guardarProducto] = useState(productoInitialState);
  const [archivo, guardarArchivo] = useState(null);
  const [enviando, cambiarEnviando] = useState(false);
  const [auth] = useContext(CRMContext);

  const history = useHistory();

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

  const agregarProducto = event => {
    event.preventDefault();
    cambiarEnviando(true);

    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('imagen', archivo);

    AXIOS.post('/productos', formData, {
      headers: { 
        'Content-Type' : 'multipart/form-data',
        Authorization: `Baerer ${auth.token}`
      }
    })
      .then(respuesta => {
        if(respuesta.data.Ok) {
          alertify.success(respuesta.data.mensaje);
          history.push('/productos');
        }else {
          alertify.error(respuesta.data.mensaje);
          cambiarEnviando(false);
        }

      })
      .catch(error => { 
        alertify.error('Error al Registrar Producto');
        cambiarEnviando(false);
      });
  }

  let textoBoton = 'Agregar Producto';
  if(enviando)
    textoBoton = <> <Spinner /> Guardando... </>;

  return (
    <Fragment>
      <h2>Nuevo Producto</h2>
      <form action="/productos" method="POST" onSubmit={agregarProducto}>
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
    </Fragment>
  );
}
 
export default NuevoProducto;
