//Variables de entorno
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const eventos = require('./routes/eventos');
const recintos = require('./routes/recintos');

//Conexion con la Base de Datos EVENTOS
mongoose.connect(process.env.MONGO_URI);

let app = express();

app.use(express.json());
app.use('/eventos', eventos);
app.use('/recintos', recintos);

app.listen(process.env.PORT);