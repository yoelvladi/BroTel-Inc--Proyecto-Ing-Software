// src/components/VerMisImagenes.js
import React, { useState, useEffect } from 'react';

function VerMisImagenes() {
  const [imagenes, setImagenes] = useState([]);
  const pacienteId = localStorage.getItem('pacienteId'); // Obtener el ID del paciente desde el localStorage

  useEffect(() => {
    // Aquí llamamos a la API para obtener las imágenes filtradas por el ID del paciente
    fetch(`http://localhost:5000/api/images/find?id_paciente=${pacienteId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`); // Lanza un error si la respuesta no es OK
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setImagenes(data.imagenes); // Asegúrate de que estás accediendo a 'imagenes'
        } else {
          console.error(data.message);
          setImagenes([]); // Maneja el caso de que no haya imágenes
        }
      })
      .catch(error => console.error('Error al cargar las imágenes:', error));
  }, [pacienteId]);

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
                <td>{imagen.imagen_file}</td>
                <td>{new Date(imagen.createdAt).toLocaleDateString()}</td> {/* Muestra la fecha de creación */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No se encontraron imágenes.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VerMisImagenes;

