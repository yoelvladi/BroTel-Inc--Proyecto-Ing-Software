import React, { useState, useEffect, useRef } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser'; // Importa dicom-parser

function VerMisImagenes() {
  const [imagenes, setImagenes] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const pacienteId = localStorage.getItem('pacienteId');
  const viewerRef = useRef(null); // Referencia al contenedor de la imagen

  useEffect(() => {
    // Configurar dicomParser en cornerstoneWADOImageLoader
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser; // Añadir dicomParser

    cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage);

    // Llama a la API para obtener las imágenes filtradas por el ID del paciente
    fetch(`http://localhost:5000/api/images/find?id_paciente=${pacienteId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setImagenes(data.imagenes);
        } else {
          console.error(data.message);
          setImagenes([]);
        }
      })
      .catch(error => console.error('Error al cargar las imágenes:', error));
  }, [pacienteId]);

  useEffect(() => {
    // Si una imagen es seleccionada, cargarla con Cornerstone
    if (imagenSeleccionada) {
      const element = viewerRef.current;

      cornerstone.enable(element); // Habilita Cornerstone en el contenedor

      const imageUrl = `http://localhost:5000/api/images/${imagenSeleccionada.imagen_file}`;
      cornerstone.loadImage('wadouri:' + imageUrl).then(image => {
        cornerstone.displayImage(element, image); // Muestra la imagen DICOM en el visor
      }).catch(err => {
        console.error('Error al cargar la imagen DICOM:', err);
      });

      // Limpiar el visor cuando la imagen se deselecciona
      return () => {
        cornerstone.disable(element);
      };
    }
  }, [imagenSeleccionada]);

  return (
    <div>
      <h1>Mis Imágenes DICOM</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre de la Imagen</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {imagenes.length > 0 ? (
            imagenes.map((imagen) => (
              <tr key={imagen.id_image}>
                <td
                  style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setImagenSeleccionada(imagen)} // Selecciona la imagen
                >
                  {imagen.imagen_file}
                </td>
                <td>{new Date(imagen.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No se encontraron imágenes.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Visor para la imagen seleccionada */}
      {imagenSeleccionada && (
        <div>
          <h2>Visualizando: {imagenSeleccionada.imagen_file}</h2>
          <div
            ref={viewerRef}
            style={{
              width: '600px',
              height: '400px',
              border: '1px solid black',
              position: 'relative'
            }}
          ></div>
          <button onClick={() => setImagenSeleccionada(null)}>Cerrar Visor</button>
        </div>
      )}
    </div>
  );
}

export default VerMisImagenes;
