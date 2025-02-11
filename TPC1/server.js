const http = require('http')
const axios = require('axios')

http.createServer((req, res) => {

    switch(req.method) {
        case "GET":
            if (req.url === "/reparacoes") { //lista de reparações
                axios.get('http://localhost:3000/reparacoes?_sort=nome')
                    .then(resp => {
                        var reparacoes = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write("<h1>Lista de Reparações</h1>")
                        res.write("<ul>")
                        reparacoes.forEach(reparacao => {
                            res.write(`<li>Nome: ${reparacao.nome}</li>`)
                            res.write(`<li>NIF: ${reparacao.nif}</li>`)
                            res.write(`<li>Data: ${reparacao.data}</li>`)
                            res.write(`<li>Viatura: ${reparacao.viatura.marca}</li>`)
                            res.write(`<li>Nº de intervenções: ${reparacao.nr_intervencoes}</li>`)
                            
                            if (reparacao.intervencoes && reparacao.intervencoes.length > 0) {
                                res.write("<ul>");
                                reparacao.intervencoes.forEach(intervencao => {
                                    res.write(`<li><a href='/intervencoes/${intervencao.codigo}'>
                                        ${intervencao.nome}</a></li>`);
                                });
                                res.write("</ul>");
                            }

                            res.write("</li><br><br>");
                        });
                        res.write("</ul>")
                        res.end()
                    })
                    .catch(err => {
                        res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.end()
                        console.log(err)
                    })
            } else if (req.url === "/intervencoes"){ // lista de intervenções
                axios.get('http://localhost:3000/intervencoes?_sort=id')
                    .then(resp => {
                        var intervencoes = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write("<h1>Lista de Intervenções</h1>")
                        res.write("<ul>")
                        intervencoes.forEach(intervencao => {
                            res.write(`<li><a href='http://localhost:1234/intervencoes/${intervencao.id}'>${intervencao.nome}</li>`)
                        })
                        res.write("</ul>")
                    })

            } else if (match = req.url.match(/\/intervencoes\/.+/)) { //cada intervenção
                var id = req.url.split("/")[2]
                axios.get(`http://localhost:3000/intervencoes/${id}`)
                    .then(resp => {
                        var intervencao = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write("<h1>Intervenções</h1>")
                        //console.log(intervencao)
                        res.write("<ul>")
                        
                        Object.entries(intervencao).forEach(([key, value]) => {
                            res.write(`<li><strong>${key}:</strong> ${value}</li>`);
                        });

                        //falta adicionar a lista de reparações aqui

                        res.write("</ul>")
                        res.end()
                    })
                    .catch(err => {
                        res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.end()
                        console.log(err)
                    })
            }


            break;

        default:
            res.writeHead(405, {'Content-Type' : 'text/html;charset=utf-8'})
            res.end()
            break;
    }


}).listen(1234)

console.log("Server à escuta na porta 1234")