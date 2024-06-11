const express = require('express');
const router = express.Router();
const db = require('../models');

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Ruta para obtener un usuario por su ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        res.status(500).json({ error: 'Error al obtener usuario por ID' });
    }
});

// Ruta para crear un nuevo usuario
router.post('/', async (req, res) => {
    const { nombre, password, email } = req.body;
    try {
        const newUser = await db.User.create({ nombre, password, email });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// Ruta para actualizar un usuario existente por su ID
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { nombre, password, email } = req.body;
    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        user.nombre = nombre;
        user.password = password;
        user.email = email;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error("Error al actualizar usuario por ID:", error);
        res.status(500).json({ error: 'Error al actualizar usuario por ID' });
    }
});

// Ruta para eliminar un usuario por su ID
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        await user.destroy();
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar usuario por ID:", error);
        res.status(500).json({ error: 'Error al eliminar usuario por ID' });
    }
});

module.exports = router;