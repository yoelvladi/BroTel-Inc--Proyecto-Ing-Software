const express = require('express');
const {Sequelize} = require("sequelize");
const db = require("./models");
const ModeloRoutes = require("./routes/modelodb");

const app = express()

app.use(express.json());


app.get("/api",(req, res) =>{
    res.json({mensaje:"Hola mi gentesita"})
})

app.use('/api/modelo', ModeloRoutes)

db.sequelize.sync().then(()=>{
    app.listen(5000,()=>{console.log("Server iniciado en el puerto 5000")})
})
