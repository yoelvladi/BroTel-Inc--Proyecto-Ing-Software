// src/components/Inicio_pacientes.js
import React from 'react';
import { Link } from 'react-router-dom';

function InicioPacientes() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to= "/VerMisImagenes">Ver mis imagenes</Link></li>
        </ul>
      </nav>
      <div>
        <h1>Bienvenido al Visualizador de Imágenes Médicas</h1>
        <p>
          En esta sección, podrás visualizar tus imágenes DICOM. Esta herramienta te permite cargar,
          explorar y visualizar detalles importantes de tus estudios médicos. Además, puedes buscar términos específicos dentro de la cabecera de las imágenes.
        </p>
        <p>
          Para ver tus imágenes guardadas, haz clic en el siguiente botón:
        </p>
      </div>
    </div>
  );
}

export default InicioPacientes;