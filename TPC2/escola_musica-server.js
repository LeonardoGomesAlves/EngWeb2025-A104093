import { createServer } from 'http'
import axios from 'axios'
import { genMainPage, genAlunosPage, genCursosPage, genInstrumentosPage, genAlunoPage, genCursoPage, genInstrumentoPage } from './mypages.js'
import { readFile } from 'fs'


createServer(function(req, res) {
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)

    if(req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
        res.write(genMainPage(d))
        res.end()
    }
    else if(req.url === '/alunos') {
        axios.get('http://localhost:3000/alunos')
          .then(function(resp){
            var reps = resp.data
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write(genAlunosPage(reps, d))
            res.end()
          })
          .catch(erro => {
            console.log("Erro " + erro)
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.end('<p>Operação na obtenção de dados: '+ erro + '</p>')
          })
    } 
    else if(req.url === '/cursos') {
        axios.get('http://localhost:3000/cursos')
          .then(function(resp){
            var reps = resp.data
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write(genCursosPage(reps, d))
            res.end()
          })
          .catch(erro => {
            console.log("Erro " + erro)
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.end('<p>Operação na obtenção de dados: '+ erro + '</p>')
          })
    } 
    else if(req.url === '/instrumentos') {
        axios.get('http://localhost:3000/instrumentos')
          .then(function(resp){
            var reps = resp.data
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write(genInstrumentosPage(reps, d))
            res.end()
          })
          .catch(erro => {
            console.log("Erro " + erro)
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.end('<p>Operação na obtenção de dados: '+ erro + '</p>')
          })
    } 
    else if (req.url.match(/w3\.css$/)) {
        readFile("w3.css", function(erro, dados) {
            if(erro) {
                res.writeHead(404, {'Content-Type' : 'text/html; charset=utf-8'})
                res.end('<p>Erro na leitura do ficheiro: ' + erro + '</p>')
            } else {
                res.writeHead(200, {'Content-Type': 'text/css'})
                res.end(dados)
            }
        })
    }
    else if (req.url.match(/alunos\/.+/)) {
        var id = req.url.split("/")[2]
        axios.get(`http://localhost:3000/alunos/${id}`)
            .then(function(resp) {
                var reps = resp.data
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(genAlunoPage(reps, d))
                res.end()
            })
    }
    else if (req.url.match(/cursos\/.+/)) {
        var id = req.url.split("/")[2]
        axios.get(`http://localhost:3000/cursos/${id}`)
            .then(function(resp) {
                axios.get(`http://localhost:3000/alunos?curso=${id}`)
                    .then(function(resp_alunos) {
                        var alunos = resp_alunos.data
                        var reps = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(genCursoPage(reps, alunos, d))
                        res.end()
                    })
            })
    }
    else if (req.url.match(/instrumentos\/.+/)) {
        var id = req.url.split("/")[2]
        axios.get(`http://localhost:3000/instrumentos/${id}`)
            .then(function(resp) {
                var reps = resp.data
                axios.get(`http://localhost:3000/alunos?instrumento=${reps["#text"]}`)
                    .then(function(resp_alunos) {
                        var alunos = resp_alunos.data
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(genInstrumentoPage(reps, alunos, d))
                        res.end()
                    })
            })
    }
    else if (req.url.match(/favicon\.ico$/)) {
        readFile("image.png", function(erro, dados) {
            if(erro) {
                res.writeHead(404, {'Content-Type' : 'text/html; charset=utf-8'})
                res.end('<p>Erro na leitura do ficheiro: ' + erro + '</p>')
            } else {
                res.writeHead(200, {'Content-Type': 'image/png'})
                res.end(dados)
            }
        })
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
        res.end('<p>Operação não suportada: '+ req.url + '</p>')
    }

}).listen(1234)

