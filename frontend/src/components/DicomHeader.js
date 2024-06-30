import React, { useState } from 'react';
import dicomParser from 'dicom-parser';
import '../styles/styles.css'; // Importa tu archivo CSS personalizado
import Nav from '../components/Nav';

const DicomHeader = () => {
  const [dicomInfo, setDicomInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);
        const dataSet = dicomParser.parseDicom(byteArray);
        
        // Extrae la información que necesitas de la cabecera DICOM
        const info = [
          { title: 'Patient Name', value: dataSet.string('x00100010') },
          { title: 'Patient ID', value: dataSet.string('x00100020') },
          { title: 'Study Date', value: dataSet.string('x00080020') },
          // Agrega más campos que desees mostrar
        ];

        setDicomInfo(info);
      } catch (error) {
        console.error('Error reading DICOM file:', error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar la información según el término de búsqueda
  const filteredDicomInfo = dicomInfo.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <nav>
        <Nav/>
      </nav>
        <div className="dicom-info-container">
          <input
            type="file"
            accept=".dcm"
            onChange={handleFileChange}
          />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar información..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {filteredDicomInfo.map((item, index) => (
            <div key={index} className="dicom-info-item">
              <h3>{item.title}</h3>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </div>  
  );
};

export default DicomHeader;
