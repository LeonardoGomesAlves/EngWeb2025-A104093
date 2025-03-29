var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/:nipc', function(req, res, next) {
  axios.get('http://localhost:16000/contratos/entidades/' + req.params.nipc)
    .then(function (contratos) {
        const nipc = req.params.nipc
        const lista_contratos = contratos.data

        if (lista_contratos.length > 0) {
            const nome_entidade = lista_contratos[0].entidade_comunicante

            const totalPrecoContratos = lista_contratos.reduce((total, contrato) => total + contrato.precoContratual, 0)
    
            res.render('entidade', { 
                title: 'Lista de Contratos da Entidade',
                totalPrecoContratos: totalPrecoContratos,
                nipc: nipc, 
                nome_entidade: nome_entidade,
                contratos: contratos.data });

        } else {
            res.status(404).send('Entidade não encontrada')
        }

    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;
