import React, { useContext } from 'react';
// CONTEXT
import { CRMContext, CRMProvider } from './context/CRMContext';

// ROUTING
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

// LAYOUT
import Header from './components/layout/Header';
import Navegacion from './components/layout/Navegacion';

// Componentes
import Clientes from './components/clientes/Clientes';
import NuevoCliente from './components/clientes/NuevoCliente';
import EditarCliente from './components/clientes/EditarCliente';

import Productos from './components/productos/Productos';
import NuevoProducto from './components/productos/NuevoProducto';
import EditarProducto from './components/productos/EditarProducto';

import Pedidos from './components/pedidos/Pedidos';
import NuevoPedido from './components/pedidos/NuevoPedido';
import EditarPedido from './components/pedidos/EditarPedido';

import Login from './components/auth/Login';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [auth] = useContext(CRMContext);
  return (
    <Route {...rest} render={(props) => (
      auth.autenticado === true
        ? <Component {...props} />
        : <Redirect to='/iniciar-sesion' />
    )} />
  )
}

const App = () => {
  
  // UTILIZAR CONTEXT EN EL COMPONENTE
  const [auth, guardarAuth] = useContext(CRMContext);
  
  return (
    <CRMProvider value={[auth, guardarAuth]}>
      <Router>
        <Header />
        <div className="grid contenedor contenido-principal">
          <Navegacion />
          <main className="caja-contenido col-9">
            <Switch>
              <PrivateRoute exact path="/" auth={auth} component={Clientes} />
              <PrivateRoute exact path="/clientes/nuevo" component={NuevoCliente} />
              <PrivateRoute exact path="/clientes/editar/:id" component={EditarCliente} />
              
              <PrivateRoute exact path="/productos" component={Productos} />
              <PrivateRoute exact path="/productos/nuevo" component={NuevoProducto} />
              <PrivateRoute exact path="/productos/editar/:id" component={EditarProducto} />
              <PrivateRoute exact path="/pedidos" component={Pedidos} />
              
              <PrivateRoute exact path="/pedidos/nuevo/:id" component={NuevoPedido} />
              <PrivateRoute exact path="/pedidos/editar/:id" component={EditarPedido} />
              
              <Route exact path="/iniciar-sesion" component={Login} />
            </Switch>
          </main>
        </div>
      </Router>
    </CRMProvider>
  );
}
 
export default App;
