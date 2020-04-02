import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

const Header = () => {
  const [auth, guardarAuth] = useContext(CRMContext);
  const history = useHistory();

  const cerrarSesion = () => {
    localStorage.setItem('token', '');
    guardarAuth({
      token: '',
      autenticado: false,
    });
    history.push('/iniciar-sesion');
  }

  return (
    <header className="barra">
      <div className="contenedor">
        <div className="contenido-barra">
          <h1>CRM - Administrador de Clientes</h1>
          {
            auth.autenticado ? 
              <button 
                type="button" 
                className="btn btn-rojo" 
                onClick={cerrarSesion}>
                <i className="far fa-times-circle"></i>
                Cerrar Sesión
              </button>
            : null
          }
        </div>
      </div>
    </header> 
  );
}
 
export default Header;
