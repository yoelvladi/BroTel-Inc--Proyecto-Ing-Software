import React, { useState, useEffect } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Nav from '../components/Nav';
import '../styles/styles.css';

const DicomViewer = () => {
  const [images, setImages] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState('');
  const [isInverted, setIsInverted] = useState(false);
  const [zoom, setZoom] = useState(1); // Zoom inicial
  const [translation, setTranslation] = useState({ x: 0, y: 0 }); // Traslación inicial
  const [isDragging, setIsDragging] = useState(false); // Estado para saber si estamos arrastrando
  const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // Posición inicial del mouse
  const [startTranslation, setStartTranslation] = useState({ x: 0, y: 0 }); // Posición inicial de la imagen

  useEffect(() => {
    const element = document.getElementById('dicomImage');
    if (element) {
      cornerstone.enable(element); // Aseguramos que el visor esté habilitado al principio
    }

    // Deshabilitar el scroll de la página
    const preventDefaultScroll = (event) => event.preventDefault();
    document.body.addEventListener('wheel', preventDefaultScroll, { passive: false });

    return () => {
      const element = document.getElementById('dicomImage');
      if (element) {
        cornerstone.disable(element); // Deshabilitar al desmontar el componente
      }
      document.body.removeEventListener('wheel', preventDefaultScroll, { passive: false });
    };
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
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
          useWebWorkers: true,
        });

        const imageIds = [];
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          if (file.name.endsWith('.dcm')) {
            const arrayBuffer = await file.arrayBuffer();
            const dataSet = dicomParser.parseDicom(new Uint8Array(arrayBuffer));

            const patientId = dataSet.string('x00100020');
            setPatientId(patientId);

            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            imageIds.push(imageId);

            const imageBase64 = await convertToBase64(file);
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
      cornerstone.enable(element); // Aseguramos que el visor esté habilitado

      for (let i = 0; i < images.length; i++) {
        const imageId = images[i];
        const image = await cornerstone.loadImage(imageId);
        cornerstone.displayImage(element, image);
        updateViewport(element);
      }
    } catch (error) {
      console.error('Error displaying images:', error);
      setError('Error displaying images');
    }
  };

  const toggleInvert = () => {
    setIsInverted(!isInverted);
    const element = document.getElementById('dicomImage');
    updateViewport(element); // Actualiza el viewport con la inversión de colores
  };

  // Manejo del zoom centrado en el mouse
  const handleZoom = (event) => {
    event.preventDefault();
    const element = document.getElementById('dicomImage');
    const viewport = cornerstone.getViewport(element);

    // Verifica que el visor esté habilitado
    if (!cornerstone.getEnabledElement(element)) return;

    // Determina la dirección del zoom (acercar o alejar)
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = viewport.scale * zoomFactor;
    setZoom(newZoom);

    // Obtiene las coordenadas del mouse dentro del visor
    const boundingRect = element.getBoundingClientRect();
    const mouseX = event.clientX - boundingRect.left;
    const mouseY = event.clientY - boundingRect.top;

    // Calcula el desplazamiento relativo en la imagen
    const scaleChange = newZoom / viewport.scale;

    // El ajuste de la traslación tiene en cuenta la posición del mouse
    const newTranslation = {
      x: (mouseX * scaleChange) - (mouseX),
      y: (mouseY * scaleChange) - (mouseY),
    };

    // Limitar el movimiento de la imagen (calculando el borde)
    const maxTranslationX = boundingRect.width * (newZoom - 1);
    const maxTranslationY = boundingRect.height * (newZoom - 1);

    // Restricciones para que la imagen no se mueva fuera del área visible
    newTranslation.x = Math.max(Math.min(newTranslation.x, maxTranslationX), -maxTranslationX);
    newTranslation.y = Math.max(Math.min(newTranslation.y, maxTranslationY), -maxTranslationY);

    setTranslation(newTranslation);

    // Actualiza el viewport con el nuevo zoom y traslación
    updateViewport(element);
  };

  // Función para actualizar la configuración del viewport con zoom y colores
  const updateViewport = (element) => {
    const viewport = cornerstone.getViewport(element);
    viewport.scale = zoom;
    viewport.translation = translation;
    viewport.invert = isInverted; // Aplica la inversión de colores
    cornerstone.setViewport(element, viewport);
  };

  // Iniciar el arrastre al hacer clic
  const startDrag = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const element = document.getElementById('dicomImage');
    const boundingRect = element.getBoundingClientRect();

    // Establecemos la posición inicial del mouse y la traslación actual de la imagen
    setStartPos({ x: e.clientX - boundingRect.left, y: e.clientY - boundingRect.top });
    setStartTranslation(translation);
  };

  // Realizar el arrastre (mover la imagen)
  const doDrag = (e) => {
    if (isDragging) {
      const element = document.getElementById('dicomImage');
      const boundingRect = element.getBoundingClientRect();

      const deltaX = (e.clientX - boundingRect.left) - startPos.x;
      const deltaY = (e.clientY - boundingRect.top) - startPos.y;

      // Actualizamos la traslación según el movimiento
      const newTranslation = {
        x: startTranslation.x + deltaX,
        y: startTranslation.y + deltaY,
      };

      setTranslation(newTranslation);
      updateViewport(element);
    }
  };

  // Detener el arrastre al soltar el clic
  const stopDrag = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <nav>
        <Nav />
      </nav>
      <div>
        <h2>Visor de Archivos DICOM</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form style={{ display: 'flex', justifyContent: 'center' }}>
          <input type="file" accept=".dcm" multiple onChange={handleFileChange} />
          <button type="button" onClick={displayImages}>Mostrar Imágenes</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={toggleInvert}>Invertir Colores</button>
        </div>
        <div
          id="dicomImage"
          className="dicom-wrapper"
          style={{ marginBottom: '10px', width: '100%', height: '500px', overflow: 'hidden' }}
          onWheel={handleZoom} // Maneja el zoom al hacer scroll
          onMouseDown={startDrag} // Iniciar el arrastre
          onMouseMove={doDrag} // Mover la imagen durante el arrastre
          onMouseUp={stopDrag} // Detener el arrastre al soltar
          onMouseLeave={stopDrag} // Detener el arrastre si se sale del área
        >
          {images.map((imageId, index) => (
            <div key={index} className="dicom-viewer">
              <canvas
                className="cornerstone-canvas"
                id={`dicomCanvas-${index}`}
                style={{ marginBottom: '10px' }}
              ></canvas>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DicomViewer;
