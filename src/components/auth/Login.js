import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AXIOS from '../../config/axios';
import alertify from 'alertifyjs';
import Spinner from '../layout/Spinner';
import { CRMContext } from '../../context/CRMContext';

const Login = () => {
  const [email, guardarEmail] = useState('');
  const [password, guardarPassword] = useState('');
  const [cargando, cambiarCargando] = useState(false);
  const [auth, guardarAuth] = useContext(CRMContext);
  
  const history = useHistory();
  if(auth.autenticado)
    history.push('/');

  const iniciarSesion = event => {
    event.preventDefault();
    cambiarCargando(true);
    const usuario = { email, password };
    AXIOS.post('iniciar-sesion', usuario)
      .then(respuesta => {
        if(respuesta.data.Ok) {
          const { token } = respuesta.data;
          localStorage.setItem('token', token);
          guardarAuth({ token, autenticado: true });
          alertify.success('Has iniciado sesion');
        }else
          alertify.error(respuesta.data.mensaje);
        cambiarCargando(false);
      })
      .catch(error => {
        cambiarCargando(false);
        alertify.error('Error al Iniciar Sesión');
      });
  }

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <div className="contenedor-formulario">
        <form onSubmit={iniciarSesion}>
          <div className="campo">
            <label>Email</label>
            <input 
              type="text"
              name="email"
              placeholder="Email para Iniciar Sesión"
              onChange={e => guardarEmail(e.target.value)}
              value={email}
              required
            />
          </div>
        
          <div className="campo">
            <label>Password</label>
            <input 
              type="password"
              name="password"
              placeholder="Password para Iniciar Sesión"
              onChange={e => guardarPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <button
            disabled={cargando}
            type="submit"
            className="btn btn-verde btn-block">
              {  cargando 
                ? <><Spinner /> Iniciando...</>
                : 'Iniciar Sesión' 
              }
          </button>
        </form>
      </div>
    </div>
  );
}
 
export default Login;
