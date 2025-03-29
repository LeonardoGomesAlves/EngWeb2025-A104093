var express = require('express');
var router = express.Router();
var Contrato = require('../controllers/contrato')

/* GET all contracts. */
router.get('/', function(req, res, next) {
  if(req.query.entidade) {
    Contrato.getContratosByEntidade(req.query.entidade)
      .then(data => res.status(200).jsonp(data))
      .catch(error => res.status(500).jsonp(erro))

  } else if(req.query.tipo) {
    Contrato.getContratosByTipo(req.query.tipo)
      .then(data => res.status(200).jsonp(data))
      .catch(error => res.status(500).jsonp(erro))

  } else {
    Contrato.getContratos()
      .then(data => res.status(200).jsonp(data))
      .catch(error => res.status(500).jsonp(erro))

  }
});

/* GET entidades ordenadas alfabeticamente. */
router.get('/entidades', function(req, res, next) {
  Contrato.getEntidades()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(erro))
});

router.get('/entidades/:nipc', function(req, res, next) {
  Contrato.getEntidadeByNipc(req.params.nipc)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(erro))
});

/* GET tipos ordenados alfabeticamente. */
router.get('/tipos', function(req, res, next) {
  Contrato.getTipos()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(erro))
});

/* GET contract by ID. */
router.get('/:id', function(req, res, next) {
  Contrato.getContratoById(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(erro))
});

/* POST inserir contrato. */
router.post('/', function(req, res, next) {
  Contrato.insert(req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(erro))
});

/* PUT atualizar contrato. */
router.put('/:id', function(req, res, next) {
  Contrato.update(req.params.id, req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(erro))
});


/* DELETE apagar contrato. */
router.delete('/:id', function(req, res, next) {
  Contrato.delete(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(erro))
});




module.exports = router;
