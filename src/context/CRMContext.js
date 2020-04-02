import React, { useState } from 'react';

const CRMContext = React.createContext([{}, () => {}]);

const CRMProvider = props => {
  let state = {
    token: '',
    autenticado: false
  }
  const token = localStorage.getItem('token');
  if(token && token.length) {
    state.token = token;
    state.autenticado = true;
  }
  const [auth, guardarAuth] = useState(state);

  return (
    <CRMContext.Provider value={[auth, guardarAuth]}>
      { props.children }
    </CRMContext.Provider>
  )
}

export { CRMContext, CRMProvider };