var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', 
    { title: 'Engenharia Web 2025',
      docente: 'jcr',
      instituicao: 'DI-UM'
     });
});

router.get('/filmes', function(req, res) {
  axios.get('http://localhost:3000/filmes')
       .then(resp => {
          res.render('filmes', {lfilmes: resp.data, title:"Lista de Filmes"})
       })
       .catch(erro => {
          console.log(erro)
          res.render('error', {error: erro})
       })
});

router.get('/filmes/edit/:id', function(req, res) {
  var filme_id = req.params.id
  axios.get(`http://localhost:3000/filmes/${filme_id}`)
      .then(resp => {
        res.render('editfilm', {filme: resp.data, title: `Editar Filme ID: ${filme_id}`})
      })
      .catch(erro => {
        console.log(erro)
        res.render('error', {error: erro})
      })
})


router.post('/filmes/edit/:id', function(req, res) {
  var filme_id = req.params.id

  axios.put(`http://localhost:3000/filmes/${filme_id}`, req.body)
      .then(resp => {
        res.redirect('/')
        console.log(`Filme ${filme_id} alterado com sucesso`)
      })
      .catch(erro => {
        console.log(erro)
        res.render('error', {error: erro})
      })

})

router.get('/filmes/delete/:id', function(req, res) {
  var filme_id = req.params.id

  axios.delete(`http://localhost:3000/filmes/${filme_id}`)
    .then(resp => {
      console.log(`Filme ${filme_id} removido com sucesso.`)
      res.redirect('/filmes')
    })
    .catch(erro => {
      console.log(erro)
      res.render('error', {error: erro})
    })
})


router.get('/actor/:nome', function(req, res) {
  var actor_nome = req.params.nome

  axios.get(`http://localhost:3000/filmes?cast_like=${actor_nome}&_sort=title&_order=asc`)
    .then(resp => {
      res.render('actorpage', {filmes: resp.data, title: `Lista de filmes do Ator: ${actor_nome}`,})
    })
    .catch(erro => {
      console.log(erro)
      res.render('error', {error: erro})
    })
})




module.exports = router;
