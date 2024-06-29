// src/App.js
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/login';
import Inicio from './components/Inicio';
import DicomViewer from './components/DicomViewer';
import DicomHeader from './components/DicomHeader';

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to ="/login">Login</Link></li>
          <li><Link to ="/DicomViewer">DicomViewer</Link></li>
          <li><Link to ="/DicomHeader">DicomHeader</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
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

export default App;

