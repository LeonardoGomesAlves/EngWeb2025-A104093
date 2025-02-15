const http = require('http')
const axios = require('axios')

function main_menu(res) {
    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
    res.write(
        `
            <html>        
                <head>
                    <title>Oficina de reparações</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
                    <style>
                        .back-button {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            z-index: 100;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        }

                        .back-button:hover {
                            background-color: #45a049;
                        }
                    </style>
                </head>

                
                <div class="w3-container w3-teal">
                    <h1>Menu Principal</h1>
                    <a href="/" class="back-button">Voltar para o Início</a>
                </div>
                
                <body>
                    <div class="w3-container">
                        <p>
                            <a href="/reparacoes">Lista de Reparações</a>
                        </p>

                        <p>
                            <a href="/intervencoes">Lista de Intervenções</a>
                        </p>

                        <p>
                            <a href="/marcas">Lista de Marcas</a>
                        </p>

                        <p>
                            <a href="/viaturas">Lista de Viaturas</a>
                        </p>
                                
                    </div>
                
                </body>
            </html>               
        `        
    )
    res.end()
}

function reparacoes(res) {
    axios.get('http://localhost:3000/reparacoes?_sort=id')
        .then(resp => {
            var reparacoes = resp.data
            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})

            res.write(`
                <html>
                <head>
                    <title>Lista de Reparações</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
                    <style>
                        .back-button {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            z-index: 100;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        }

                        .back-button:hover {
                            background-color: #45a049;
                        }

                        .scrollable {
                            max-height: 700;
                            overflow-y: auto;
                        }

                    </style>
                </head>

                <body class="w3-light-grey">
                    <div class="w3-container w3-teal">
                        <h1>Lista de Reparações</h1>
                        <a href="/" class="back-button">Voltar para o Início</a>
                    </div>
                    
                    <div class="w3-container w3-margin-top scrollable">
                        <div class="w3-card w3-white w3-padding">
                            <ul class="w3-ul">
            `);

            reparacoes.forEach(reparacao => {
                res.write(`
                    <li class="w3-padding-16">
                        <div class="w3-container">
                            <p><a href='http://localhost:1234/reparacoes/${reparacao.id}'><strong>Reparação ID:</strong> ${reparacao.id}</a></p>
                `);

                res.write(`</div></li>`);
            });

            res.write(`
                            </ul>
                        </div>
                    </div>
                </body>
                </html>
            `);
            
            res.end();
        })
        .catch(err => {
            res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
            res.end('<p class="w3-red w3-padding">Erro ao carregar reparações</p>')
            console.log(err)
        });
}

function reparacaoById(res, id) {
    axios.get(`http://localhost:3000/reparacoes/${id}`)
        .then(resp => {
            var reparacao = resp.data
            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
            res.write(
                `
                <html>
                <head>
                    <title>Reparação</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
                    <style>
                            .back-button {
                                position: absolute;
                                top: 10px;
                                right: 10px;
                                z-index: 100;
                                padding: 10px 20px;
                                background-color: #4CAF50;
                                color: white;
                                text-decoration: none;
                                border-radius: 5px;
                                font-weight: bold;
                            }

                            .back-button:hover {
                                background-color: #45a049;
                            }

                            .scrollable {
                                max-height: 700;
                                overflow-y: auto;
                            }
                        </style>
                </head>

                
                <body class="w3-light-grey">
                <div class="w3-container w3-teal">
                    <h1>Reparação</h1>
                    <a href="/" class="back-button">Voltar para o Início</a>
                </div>

                    <div class="w3-container scrollable">
                        <h3>Reparação ID: ${reparacao.id}</h3>
                        <p><strong>Cliente:</strong> ${reparacao.nome}</p>
                        <p><strong>NIF:</strong> ${reparacao.nif}</p>
                        <p><strong>Data:</strong> ${reparacao.data}</p>
                        <p><strong>Viatura:<a href='/viaturas/${reparacao.viatura.id}'></strong> ${reparacao.viatura.matricula}</a></p>
                        <p><strong>Nº de Intervenções:</strong> ${reparacao.nr_intervencoes}</p>
                

                `
            )

            if (reparacao.intervencoes && reparacao.intervencoes.length > 0) {
                res.write(`
                    <div class="w3-panel w3-pale-blue w3-leftbar w3-border-blue">
                        <h4>Intervenções:</h4>
                        <ul class="w3-ul w3-hoverable">
                `);
                reparacao.intervencoes.forEach(intervencao => {
                    res.write(`
                        <li>
                            <a href='/intervencoes/${intervencao.id}' class="w3-text-teal"> ID: ${intervencao.id} - 
                                ${intervencao.nome}
                            </a>
                        </li>
                    `);
                });
                res.write(`</ul></div>`);
            }

            res.write(
                `
                    </div>
                </body>
                </html>
                `
                )

            res.end()
        })
        .catch(err => {
            res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
            res.end('<p class="w3-red w3-padding">Erro ao carregar reparações</p>')
            console.log(err)
        });
}

function intervencoes(res) {
    axios.get('http://localhost:3000/intervencoes?_sort=id')
        .then(resp => {
            var intervencoes = resp.data
            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
            
            res.write(`
                <html>
                <head>
                    <title>Lista de Intervenções</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
                    <style>
                        .back-button {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            z-index: 100;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        }

                        .back-button:hover {
                            background-color: #45a049;
                        }

                        .scrollable {
                            max-height: 700;
                            overflow-y: auto;
                        }
                    </style>
                </head>

                
                <body class="w3-light-grey">
                    <div class="w3-container w3-teal">
                        <h1>Lista de Intervenções</h1>
                        <a href="/" class="back-button">Voltar para o Início</a>
                    </div>
                    
                    <div class="w3-container w3-margin-top scrollable">
                        <div class="w3-card w3-white w3-padding">
                            <ul class="w3-ul">
            `); 
            
           
            intervencoes.forEach(intervencao => {
                res.write(
                    `<li class="w3-padding-16">
                        <div class="w3-container">
                            <p><a href='http://localhost:1234/intervencoes/${intervencao.id}'><strong>ID:${intervencao.id} - ${intervencao.nome}</strong></a></p>
                    `
                )
                res.write(`</div></li>`);
            })
            res.write(`
                            </ul>
                        </div>
                    </div>
                </body>
                </html>
            `);
            res.end()
        })
        .catch(err => {
            res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
            res.end('<p class="w3-red w3-padding">Erro ao carregar intervenções</p>')
            console.log(err)
        });
}

function single_intervencao(res, id) {
    axios.get(`http://localhost:3000/intervencoes/${id}`)
        .then(resp => {
            var intervencao = resp.data
            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})

            res.write(
                `
                <html>
                <head>
                    <title>Intervenção</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
                    <style>
                        .back-button {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            z-index: 100;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        }

                        .back-button:hover {
                            background-color: #45a049;
                        }

                        .scrollable {
                            max-height: 700;
                            overflow-y: auto;
                        }
                    </style>
                </head>
                    
                    
                <body class="w3-light-grey">
                <div class="w3-container w3-teal">
                    <h1>Intervenção</h1>
                    <a href="/" class="back-button">Voltar para o Início</a>
                    </div>

                    <div class="w3-container">
                        <h3>Intervenção ID: ${intervencao.id}</h3>
                        <p><strong>Nome:</strong> ${intervencao.nome}</p>
                        <p><strong>Descrição:</strong> ${intervencao.descricao}</p>
                        `
            )


            if (Array.isArray(intervencao.reparacoes_ids) && intervencao.reparacoes_ids.length > 0) {
                res.write(`
                    <div class="w3-panel w3-pale-blue w3-leftbar w3-border-blue scrollable">
                        <h4>Reparações:</h4>
                        <ul class="w3-ul w3-hoverable">
                `);
                intervencao.reparacoes_ids.forEach(id => {
                    res.write(`
                        <li>
                            <a href='/reparacoes/${id}' class="w3-text-teal">
                                Reparação ID: ${id}
                            </a>
                        </li>
                    `);
                });
                res.write(`</ul></div>`);
            }

            res.write(
                `
                    </div>
                    </body>
                </html>
                `
            )
                    
            res.end()
        })
        .catch(err => {
            res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
            res.end()
            console.log(err)
        })
}

function marcas(res) {
    axios.get('http://localhost:3000/marcas?_sort=nome')
        .then(resp => {
            var marcas = resp.data
            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
            
            res.write(`
                <html>
                <head>
                    <title>Lista de Marcas</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
                    <style>
                        .back-button {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            z-index: 100;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        }

                        .back-button:hover {
                            background-color: #45a049;
                        }

                        .scrollable {
                            max-height: 700;
                            overflow-y: auto;
                        }
                    </style>
                </head>

                
                <body class="w3-light-grey">
                    <div class="w3-container w3-teal">
                        <h1>Lista de Marcas</h1>
                        <a href="/" class="back-button">Voltar para o Início</a>
                    </div>
                    
                    <div class="w3-container w3-margin-top scrollable">
                        <div class="w3-card w3-white w3-padding">
                            <ul class="w3-ul">
            `); 
            
           
            marcas.forEach(marca => {
                res.write(
                    `<li class="w3-padding-16">
                        <div class="w3-container">
                            <p><a href='http://localhost:1234/marcas/${marca.id}'><strong>${marca.nome}</strong></a></p>
                    `
                )
                res.write(`</div></li>`);
            })
            res.write(`
                            </ul>
                        </div>
                    </div>
                </body>
                </html>
            `);
            res.end()
        })
        .catch(err => {
            res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
            res.end('<p class="w3-red w3-padding">Erro ao carregar marcas</p>')
            console.log(err)
        });
}

function marcaById(res, id){
    axios.get(`http://localhost:3000/marcas/${id}`)
        .then(resp => {
            var marca = resp.data
            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})

            res.write(
                `
                <html>
                <head>
                    <title>Veículos ${marca.nome}</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
                    <style>
                        .back-button {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            z-index: 100;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        }

                        .back-button:hover {
                            background-color: #45a049;
                        }

                        .scrollable {
                            max-height: 700;
                            overflow-y: auto;
                        }
                    </style>
                </head>

                <body class="w3-light-grey">
                    <div class="w3-container w3-teal">
                        <h1>Veículos ${marca.nome}</h1>
                        <a href="/" class="back-button">Voltar para o Início</a>
                    </div>

                    <div class="w3-container">
                        <h3>Marca ID: ${marca.id}</h3>
                        <p>Veículos:</p>
                        `
            )


            if (Array.isArray(marca.viaturas) && marca.viaturas.length > 0) {
                res.write(`
                    <div class="w3-panel w3-pale-blue w3-leftbar w3-border-blue scrollable">
                        <ul class="w3-ul w3-hoverable">
                `);
                marca.viaturas.forEach(viatura => {
                    res.write(`
                        <li>
                            <a href='/viaturas/${viatura.id_viatura}' class="w3-text-teal">
                                Matrícula: ${viatura.matricula}
                            </a>
                        </li>
                    `);
                });
                res.write(`</ul></div>`);
            }

            res.write(
                `
                    </div>
                    </body>
                </html>
                `
            )
                    
            res.end()
        })
        .catch(err => {
            res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
            res.end()
            console.log(err)
        })
}

function viaturas(res) {
    axios.get('http://localhost:3000/viaturas?_sort=nome')
        .then(resp => {
            var viaturas = resp.data
            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
            
            res.write(`
                <html>
                <head>
                    <title>Lista de Viaturas</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
                    <style>
                        .back-button {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            z-index: 100;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        }

                        .back-button:hover {
                            background-color: #45a049;
                        }

                        .scrollable {
                            max-height: 700;
                            overflow-y: auto;
                        }
                    </style>
                </head>

                <body class="w3-light-grey">
                    <div class="w3-container w3-teal">
                        <h1>Lista de Viaturas</h1>
                        <a href="/" class="back-button">Voltar para o Início</a>
                    </div>
                    
                    <div class="w3-container w3-margin-top scrollable">
                        <div class="w3-card w3-white w3-padding">
                            <ul class="w3-ul">
            `); 
            
           
            viaturas.forEach(viatura => {
                res.write(
                    `<li class="w3-padding-16">
                        <div class="w3-container">
                            <p><a href='http://localhost:1234/viaturas/${viatura.id}'><strong>${viatura.matricula}</strong></a></p>
                    `
                )
                res.write(`</div></li>`);
            })
            res.write(`
                            </ul>
                        </div>
                    </div>
                </body>
                </html>
            `);
            res.end()
        })
        .catch(err => {
            res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
            res.end('<p class="w3-red w3-padding">Erro ao carregar marcas</p>')
            console.log(err)
        });
}

function viaturaById(res, id) {
    axios.get(`http://localhost:3000/viaturas/${id}`)
        .then(resp => {
            var viatura = resp.data
            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})

            res.write(
                `
                <html>
                <head>
                    <title>Viatura</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
                    <style>
                        .back-button {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            z-index: 100;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        }

                        .back-button:hover {
                            background-color: #45a049;
                        }

                        .scrollable {
                            max-height: 700;
                            overflow-y: auto;
                        }
                    </style>
                </head>

                <body class="w3-light-grey">
                    <div class="w3-container w3-teal">
                        <h1>Viatura</h1>
                        <a href="/" class="back-button">Voltar para o Início</a>
                    </div>

                    <div class="w3-container">
                        <h3>Viatura ID: ${viatura.id}</h3>
                        <p><strong>Matrícula:</strong> ${viatura.matricula}</p>
                        <p><strong>Marca:</strong> ${viatura.marca}</p>
                        <p><strong>Model:</strong> ${viatura.modelo}</p>
                        <p><strong>Nº de reparações:</strong> ${viatura.n_reparacoes}</p>
                        `
            )

            if (Array.isArray(viatura.reparacoes_ids) && viatura.reparacoes_ids.length > 0) {
                res.write(`
                    <div class="w3-panel w3-pale-blue w3-leftbar w3-border-blue scrollabe">
                        <ul class="w3-ul w3-hoverable">
                `);
                viatura.reparacoes_ids.forEach(reparacao => {
                    res.write(`
                        <li>
                            <a href='/reparacoes/${reparacao}' class="w3-text-teal">
                                Reparação ID: ${reparacao}
                            </a>
                        </li>
                    `);
                });
                res.write(`</ul></div>`);
            }

            res.write(
                `
                    </div>
                    </body>
                </html>
                `
            )
                    
            res.end()
        })
        .catch(err => {
            res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
            res.end()
            console.log(err)
        })
}

http.createServer((req, res) => {

    switch(req.method) {
        case "GET":

            if (req.url === "/") { // menu principal
                main_menu(res)
            }

            else if (req.url === "/reparacoes") { //lista de reparações
                reparacoes(res)
            
            } else if (req.url === "/intervencoes") { // lista de intervenções
                intervencoes(res)

            } else if (req.url === "/marcas") {
                marcas(res)

            } else if (req.url === "/viaturas") {
                viaturas(res)

            } else if (match = req.url.match(/\/intervencoes\/.+/)) { //cada intervenção
                var id = req.url.split("/")[2]
                single_intervencao(res, id)                
            } else if (match = req.url.match(/\/reparacoes\/.+/)) {
                var id = req.url.split("/")[2]
                reparacaoById(res, id)
            } else if (match = req.url.match(/\/marcas\/.+/)) {
                var id = req.url.split("/")[2]
                marcaById(res, id)
            } else if (match = req.url.match(/\/viaturas\/.+/)) {
                var id = req.url.split("/")[2]
                viaturaById(res, id)
            }


            break;

        default:
            res.writeHead(405, {'Content-Type' : 'text/html;charset=utf-8'})
            res.end()
            break;
    }


}).listen(1234)

console.log("Server à escuta na porta 1234")