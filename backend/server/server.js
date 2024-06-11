const express = require('express');
const { Sequelize } = require("sequelize");
const db = require("../models");
const userRoutes = require("../routes/userRoutes");

const app = express();

app.use(express.json());

// Ruta de prueba
app.get("/api", (req, res) => {
    res.json({ mensaje: "Hola mi gentesita" });
});

// Rutas para el modelo
app.use('/api/users', userRoutes);

// Sincronizar modelos con la base de datos
db.sequelize.sync().then(() => {
    // Iniciar el servidor
    app.listen(5000, () => {
        console.log("Servidor iniciado en el puerto 5000");
    });
});

