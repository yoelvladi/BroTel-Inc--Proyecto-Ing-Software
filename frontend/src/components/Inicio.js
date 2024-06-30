import React from 'react';
import { Route, Routes } from 'react-router-dom';
import About from '../components/About';
import Contact from '../components/Contact';
import Login from '../components/login';
import Inicio from '../components/Inicio';
import DicomViewer from '../components/DicomViewer';
import DicomHeader from '../components/DicomHeader';
import Registro from '../components/Registro';
import Nav from '../components/Nav';

function Dashboard() {
  return (
    <div className="App">
      <nav>
        <Nav/>
      </nav>
      <div>
        <h1>Bienvenidos al Visualizador de Imágenes de cabecera DICOM</h1>
      </div>
      <Routes>
        
        <Route path="/registro" element={<Registro />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/DicomViewer" element={<DicomViewer />} />
        <Route path="/DicomHeader" element={<DicomHeader />} />
      </Routes>
    </div>
  );
}


export default Dashboard;