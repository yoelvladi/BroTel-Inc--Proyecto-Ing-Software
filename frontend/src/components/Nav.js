import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <ul>
      <li><Link to="/contact">Contact</Link></li>
      <li><Link to="/DicomViewer">DicomViewer</Link></li>
      <li><Link to="/DicomHeader">DicomHeader</Link></li>
    </ul>
  );
}

export default Navigation;