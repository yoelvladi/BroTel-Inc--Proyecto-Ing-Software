import React, { useState } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Nav from '../components/Nav'
import '../styles/styles.css'; // Importa tu archivo CSS personalizado

const DicomViewer = () => {
  const [images, setImages] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState('');

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // Esto será el archivo en formato base64
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const anadirimagen = async (imageBase64, patientId) => {
    try {
      const response = await fetch('http://localhost:5000/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageBase64,
          patientId: patientId,
        }),
      });

      if (response.ok) {
        console.log('Imagen y ID de paciente enviados correctamente');
      } else {
        console.error('Error al enviar la imagen y el ID de paciente');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleFileChange = async (e) => {
    const fileList = e.target.files;
    if (fileList.length > 0) {
      try {
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        cornerstoneWADOImageLoader.configure({
          useWebWorkers: true
        });

        const imageIds = [];
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          if (file.name.endsWith('.dcm')) {
            const arrayBuffer = await file.arrayBuffer();
            const dataSet = dicomParser.parseDicom(new Uint8Array(arrayBuffer));

            const patientId = dataSet.string('x00100020');
            setPatientId(patientId); // Guardar el ID del paciente en el estado

            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            imageIds.push(imageId);

            const imageBase64 = await convertToBase64(file)

            // Llamar a la función para enviar la imagen y el ID al backend
            await anadirimagen(imageBase64, patientId);

          }
        }

        setImages(imageIds);
        setError('');
      } catch (error) {
        console.error('Error loading images:', error);
        setError('Error loading images');
      }
    }
  };

  const displayImages = async () => {
    try {
      const element = document.getElementById('dicomImage');
      cornerstone.enable(element);

      for (let i = 0; i < images.length; i++) {
        const imageId = images[i];
        const image = await cornerstone.loadImage(imageId);
        cornerstone.displayImage(element, image);
      }
    } catch (error) {
      console.error('Error displaying images:', error);
      setError('Error displaying images');
    }
  };

  return (
    <div>
      <nav>
        <Nav/>
      </nav>
      <div>
        <h2>Visor de Archivos DICOM</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form style={{ display: 'flex', justifyContent: 'center' }}>
          <input type="file" accept=".dcm" multiple onChange={handleFileChange} />
          <button type="button" onClick={displayImages}>Mostrar Imágenes</button>
        </form>
        <div id="dicomImage" className="dicom-wrapper">
          {images.map((imageId, index) => (
            <div key={index} className="dicom-viewer">
              <canvas className="cornerstone-canvas" id={`dicomCanvas-${index}`}></canvas>
            </div>
          ))}
        </div>
      </div>
      </div>
  );
};

export default DicomViewer;
