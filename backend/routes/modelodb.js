const express = require('express');
const { ModeloDB } = require('../models');

const router = express.Router();

// Crear un nuevo documento
router.post('/', async (req, res) => {
  try {
    const nuevoDocumento = await ModeloDB.create(req.body);
    res.status(201).json(nuevoDocumento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el documento' });
  }
});

// Obtener todos los documentos
router.get('/', async (req, res) => {
  try {
    const documentos = await ModeloDB.findAll();
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los documentos' });
  }
});

module.exports = router;