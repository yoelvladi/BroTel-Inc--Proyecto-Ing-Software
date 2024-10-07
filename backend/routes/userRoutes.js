const express = require('express');
const router = express.Router();
const db = require('../models');
// Ruta del login
const login = async (req, res) => {
    const { nombre, password } = req.body;
    try {
        // Busca en el modelo User
        const user = await db.User.findOne({ where: { nombre, password } });
        if (user) {
            return res.json({ success: true, user, permisos: true }); // Permisos true para user
        }

        // Busca en el modelo Pacient si no se encontró en User
        const pacient = await db.Pacient.findOne({ where: { nombre_paciente:nombre, password_paciente:password } });
        if (pacient) {
            return res.json({ success: true, user: pacient, permisos: false }); // Permisos false para paciente
        }

        return res.status(401).json({ success:false, error: 'Datos Incorrectos' });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
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

const registro = async (req, res) => {
    const { nombre, password, email, permisos } = req.body; // Agrega permisos aquí
    try {
        // Verificar si el usuario ya existe
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        // Crear el nuevo usuario con permisos como booleano
        const newUser = await db.User.create({ nombre, password, email, permisos });
        res.status(201).json({ success: true, message: 'Usuario registrado correctamente', user: newUser });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ success: false, message: 'Error al crear usuario' });
    }
};



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
const verifyPermisos = async (req, res) => {
    const { id_medico } = req.params; // Obtenemos el ID del paciente de los parámetros de la URL
    try {
        // Buscamos al paciente por su ID
        const medico = await db.User.findByPk(id_paciente);

        // Verificamos si existe el paciente
        if (!medico) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }

        // Retornamos el valor de permisos
        res.json({ success: true, permisos: medico.permisos });
    } catch (error) {
        console.error("Error al verificar permisos:", error);
        res.status(500).json({ success: false, message: 'Error al verificar permisos' });
    }
};
module.exports ={login,registro,verifyPermisos};