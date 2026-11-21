const express = require("express");

let Evento = require ("../models/evento.js");
let Recinto = require ("../models/recinto.js")
let router = express.Router();

//Obtener listado de todos los eventos almacenados
router.get('/', async (req, res) => {
    try {       
        let resultado = await Evento.find().populate("recinto");
        if (resultado.length > 0) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(500).send({ok: false, error: "No se han encontrado eventos"});    
        }
    } catch(error) {
        res.status(500).send({ok: false, error: "No se han encontrado eventos"});
    }
});

//Obtener el evento segun su ID
router.get('/:id', async (req, res) => {
    try {       
        let resultado = await Evento.findById(req.params.id).populate("recinto");
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `Evento ${req.params.id} no encontrado`});    
        }
    } catch(error) {
        res.status(404).send({ok: false, error: `Evento ${req.params.id} no encontrado`});    
    }
});

//Obtener evento segun el nombre de la ciudad
router.get('/localidad/:nombre', async (req, res) => {
    try {
        let resultadoRecintos = await Recinto.find({localidad: req.params.nombre});
        if (resultadoRecintos.length > 0) {
            const idRecintos = resultadoRecintos.map(r => r._id);
            let resultado = await Evento.find({    
                recinto: { $in: idRecintos },
                fecha: { $gte: new Date() }
            });
            if (resultado.length > 0) {
                res.status(200).send({ok: true, resultado: resultado});
            } else {
            res.status(404).send({ok: false, error: `No se han encontrado eventos`});
            }
        } else {
            res.status(404).send({ok: false, error: `No se han encontrado eventos`});
        }
    } catch(error) {
        res.status(404).send({ok: false, error: `No se han encontrado eventos`});
    }
});

//Publicar eventos
router.post('/', async (req, res) => {
    try {
        const eventoAdd = new Evento({
            nombre: req.body.nombre,
            fecha: req.body.fecha,
            entradas: req.body.entradas,
            recinto: req.body.recinto,
        });
        const resultadoAdd = await eventoAdd.save();
        res.status(201).send({ok: true, resultado: resultadoAdd});
    } catch (error) {
        res.status(500).send({ok: false, error: `Error añadiendo evento`});
    }
});

//Actualizar datos de evento segun un id
router.put('/:id', async (req, res) => {
    try {
        let resultado = await Evento.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `Error actualizando evento ${req.params.id}`});
        }          
    } catch (error) {
        res.status(404).send({ok: false, error: `Error actualizando evento ${req.params.id}`});
    }
});

//Elimina un evento segun un id
router.delete('/:id', async (req, res) => {
    try {
        let resultado = await Evento.findByIdAndDelete(req.params.id);
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `Error eliminando evento ${req.params.id}`});
        }       
    } catch (error) {
        res.status(404).send({ok: false, error: `Error eliminando evento ${req.params.id}`});
    }
});

//Obtiene precio y n de entradas disponibles segun id de evento
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        let eventoId = await Evento.findById(req.params.idEvento);
        if (eventoId) {
            let entrada = eventoId.entradas.find(e => e.tipo === req.params.tipoEntrada);
            if (entrada) {
                res.status(200).send({
                    ok: true, 
                    resultado: {
                        precio: entrada.precio, 
                        disponibles: entrada.disponibles
                    }
                });
            } else {
                res.status(404).send({
                    ok: false, 
                    error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
                });    
            }   
        } else {
            res.status(404).send({
                ok: false, 
                error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
            });    
        }   
    } catch (error) {
        res.status(404).send({
            ok: false, 
            error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
        });
    }
});

//Resta X entradas de la cantidad de entradas disponibles para el evento y tipo de entrada indicados.
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {
        let eventoId = await Evento.findById(req.params.idEvento);
        if (eventoId) {
            let entrada = eventoId.entradas.find(e => e.tipo === req.params.tipoEntrada);
            if (entrada) {
                let num = Number(req.params.cantidad);
                num = entrada.disponibles - num;
                if (num >= 0) {
                    entrada.disponibles = num;
                    await eventoId.save();
                    res.status(200).send({
                        ok: true, 
                        resultado: eventoId 
                    });
                } else {
                    res.status(404).send({
                        ok: false, 
                        error: `Error actualizando entradas del evento ${req.params.idEvento}`
                    });
                }
            } else {
                res.status(404).send({
                    ok: false, 
                    error: `Error actualizando entradas del evento ${req.params.idEvento}`
                });    
            }   
        } else {
            res.status(404).send({
                ok: false, 
                error: `Error actualizando entradas del evento ${req.params.idEvento}`
            });    
        }   
    } catch (error) {
        res.status(404).send({
            ok: false, 
            error: `Error actualizando entradas del evento ${req.params.idEvento}`
        });
    }
});



module.exports = router;