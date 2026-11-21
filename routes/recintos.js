const express = require('express')

let Recinto = require ("../models/recinto");
let router = express.Router();

//Obtener listado de todos los recintos almacenados
router.get('/', async (req, res) => {
    try {
        let resultado = await Recinto.find();
        if (resultado.length > 0) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(500).send({ok: false, error: "No se han encontrado recintos"});    
        }
    } catch(error) {
        res.status(500).send({ok: false, error: "No se han encontrado recintos"});
    }
});

//Obtener recinto segun su ID
router.get('/:id', async (req, res) => {
    try {
        let resultado = await Recinto.findById(req.params.id);
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `Recinto ${req.params.id} no encontrado`});
        }
    } catch(error) {
        res.status(404).send({ok: false, error: `Recinto ${req.params.id} no encontrado`});
    }
});

//Obtener recinto segun el nombre de la ciudad
router.get('/localidad/:nombre', async (req, res) => {
    try {
        let resultado = await Recinto.find({localidad: req.params.nombre});
        if (resultado.length > 0) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `No se han encontrado recintos de la localidad indicada`});
        }
    } catch(error) {
        res.status(404).send({ok: false, error: `No se han encontrado recintos de la localidad indicada`});
    }
});

//Publicar recinto
router.post('/', async (req, res) => {
    try {
        let recintoAdd = new Recinto({
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            localidad: req.body.localidad,
            aforoMaximo: req.body.aforoMaximo
        });

        let resultadoAdd = await recintoAdd.save();
        res.status(201).send({ok: true, resultado: resultadoAdd});
    } catch(error) {
        res.status(500).send({ok: false, error: `Error añadiendo recinto`});
    }
});

//Eliminar recinto segun su ID
router.delete('/:id', async (req, res) => {
    try {
        let resultado = await Recinto.findByIdAndDelete(req.params.id);
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `Error eliminando recinto ${req.params.id}`});
        }
    } catch(error) {
        res.status(404).send({ok: false, error: `Error eliminando recinto ${req.params.id}`});
    }
});

module.exports = router;