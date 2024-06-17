// src/App.js
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/login';
import Inicio from './components/Inicio';

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to ="/login">Login</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </div>
  );
}

export default App;

