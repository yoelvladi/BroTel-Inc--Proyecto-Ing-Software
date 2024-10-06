const express = require('express');
const router = express.Router();
const db = require('../models');

const login = async (req, res) => {
    const { nombre, password } = req.body;
    try {
        const user = await db.User.findOne({ where: { nombre, password } });
        if (!user) {
            return res.status(401).json({ error: 'Datos Incorrectos' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
const registro = async (req, res) => {
    const { nombre, password, email, permisos } = req.body;
    try {
        // Verificar si el usuario ya existe
        const existingUser = await db.Pacient.findOne({ where: { email_paciente: email} });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        // Crear el nuevo usuario sin encriptar la contraseña
        const newUser = await db.Pacient.create({ nombre_paciente:nombre, password_paciente:password, email_paciente:email,permisos });
        res.status(201).json({ success: true, message: 'Usuario registrado correctamente', user: newUser });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ success: false, message: 'Error al crear usuario' });
    }
};
const verifyPermisos = async (req, res) => {
    const { id_paciente } = req.params; // Obtenemos el ID del paciente de los parámetros de la URL
    try {
        // Buscamos al paciente por su ID
        const paciente = await db.Pacient.findByPk(id_paciente);

        // Verificamos si existe el paciente
        if (!paciente) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }

        // Retornamos el valor de permisos
        res.json({ success: true, permisos: paciente.permisos });
    } catch (error) {
        console.error("Error al verificar permisos:", error);
        res.status(500).json({ success: false, message: 'Error al verificar permisos' });
    }
};

module.exports={verifyPermisos,login,registro}
