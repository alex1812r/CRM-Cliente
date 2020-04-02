import React from 'react';
import './Spinner.css';

const Spinner = ({ fullWidth }) => (
  <span className={`sk-fading-circle ${ fullWidth ? 'fullWidth' : '' }`}>
    <span className="sk-circle1 sk-circle"></span>
    <span className="sk-circle2 sk-circle"></span>
    <span className="sk-circle3 sk-circle"></span>
    <span className="sk-circle4 sk-circle"></span>
    <span className="sk-circle5 sk-circle"></span>
    <span className="sk-circle6 sk-circle"></span>
    <span className="sk-circle7 sk-circle"></span>
    <span className="sk-circle8 sk-circle"></span>
    <span className="sk-circle9 sk-circle"></span>
    <span className="sk-circle10 sk-circle"></span>
    <span className="sk-circle11 sk-circle"></span>
    <span className="sk-circle12 sk-circle"></span>
  </span>
);
 
export default Spinner;