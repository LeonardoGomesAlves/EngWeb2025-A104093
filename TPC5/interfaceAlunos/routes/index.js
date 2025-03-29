var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Engenharia Web 2025' });
});

/* GET lista alunos. */
router.get('/alunos', function(req, res, next) {
  axios.get('http://localhost:3000/alunos')
    .then(resp => {
      var alunos = resp.data
      res.render('alunos', {
        tit: 'Lista de alunos',
        alunos: alunos
      })
    })
    .catch(error => {
      console.log(error);
      res.render('error', {error: error})
    })
});

/* GET aluno. */
router.get('/alunos/:id', function(req, res, next) {
  axios.get(`http://localhost:3000/alunos/${req.params.id}`)
    .then(resp => {
      var aluno = resp.data
      res.render('aluno', {
        title: 'Engenharia Web 2025',
        tit: `Aluno: ${req.params.id}`,
        aluno: aluno
      })
    })
    .catch(error => {
      console.log(error);
      res.render('error', {error: error})
    })
});

/*POST editar aluno*/
router.post('/alunos/:id', function(req, res, next) {
  axios.put(`http://localhost:3000/alunos/${req.params.id}`, req.body)
    .then(resp => {
      var aluno = resp.data
      res.redirect(`/alunos/${req.params.id}`)
    })
    .catch(error => {
      console.log(error);
      res.render('error', {error: error})
    })
});

/* GET adicionar aluno. */
router.get('/adicionar-aluno', function(req, res, next) {
  res.render('add_aluno', {
    title: 'Engenharia Web 2025'
  })
});

router.post('/adicionar-aluno', function(req, res, next) {
  axios.post('http://localhost:3000/alunos/', req.body)
    .then(resp => {
      var aluno = resp.data
      res.redirect('http://localhost:3001/alunos/' + aluno._id)
    })
    .catch(error => {
      console.log(error);
      res.render('error', {error: error})
    })
})

router.get('/alunos/delete/:id', function(req, res) {
  var aluno_id = req.params.id

  axios.delete(`http://localhost:3000/alunos/${aluno_id}`)
    .then(resp => {
      console.log(`Aluno ${aluno_id} removido com sucesso.`)
      res.redirect('/alunos')
    })
    .catch(erro => {
      console.log(erro)
      res.render('error', {error: erro})
    })
})

module.exports = router;
