// mypages.js

export function genMainPage(data) {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Escola de Música</title>        
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-blue">
                    <h1>Consultas</h1>
                </header>

                <div class="w3-container">
                    <ul class="w3-ul">
                        <li>
                            <a href="/alunos">Lista de Alunos</a>
                        </li>

                        <li>
                            <a href="/cursos">Lista de Cursos</a>
                        </li>

                        <li>
                            <a href="/instrumentos">Lista de Instrumentos</a>
                        </li>

                    </ul>
                </div>

                <footer class="w3-container w3-blue">
                    <h5>TPC2 de EngWeb2025 - ${data}</h5>
                </footer>
            </div>
        </body>
    </html>  
    `

    return pagHTML
}

export function genAlunosPage(lalunos, data) {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Escola de Música</title>        
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h1>Lista de Alunos</h1>
                </header>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                            <th>Instrumento</th>
                        </tr>

                        `

    lalunos.forEach(aluno => {
        pagHTML += `
        <tr>
            <td><a href="/alunos/${aluno.id}">${aluno.id}</a></td>
            <td>${aluno.nome}</td>
            <td>${aluno.instrumento}</td>
        </tr>
        `
    });


    pagHTML +=
                        `
                    </table>
                </div>

                <footer class="w3-container w3-purple">
                    <h5>TPC2 de EngWeb2025 - ${data}</h5>
                </footer>
            </div>
        </body>
    </html>  
    `

    return pagHTML
}

export function genCursosPage(lcursos, data) {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Escola de Música</title>        
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h1>Lista de Cursos</h1>
                </header>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>Id</th>
                            <th>Designação</th>
                        </tr>

                        `

    lcursos.forEach(curso => {
        pagHTML += `
        <tr>
            <td><a href="/cursos/${curso.id}">${curso.id}</a></td>
            <td>${curso.designacao}</td>
        </tr>
        `
    });


    pagHTML +=
                        `
                    </table>
                </div>

                <footer class="w3-container w3-purple">
                    <h5>TPC2 de EngWeb2025 - ${data}</h5>
                </footer>
            </div>
        </body>
    </html>  
    `

    return pagHTML
}

export function genInstrumentosPage(linstrumentos, data) {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Escola de Música</title>        
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h1>Lista de Instrumentos</h1>
                </header>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                        </tr>

                        `

    linstrumentos.forEach(instrumento => {
        pagHTML += `
        <tr>
            <td><a href="/instrumentos/${instrumento.id}">${instrumento.id}</a></td>
            <td>${instrumento["#text"]}</td>
        </tr>
        `
    });


    pagHTML +=
                        `
                    </table>
                </div>

                <footer class="w3-container w3-purple">
                    <h5>TPC2 de EngWeb2025 - ${data}</h5>
                </footer>
            </div>
        </body>
    </html>  
    `

    return pagHTML
}

export function genAlunoPage(aluno, data) {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Escola de Música</title>        
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h1>Perfil de Aluno</h1>
                </header>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                            <th>Data de Nascimento</th>
                            <th>Curso</th>
                            <th>Ano do Curso</th>
                            <th>Instrumento</th>
                        </tr>

                        `

    
    pagHTML += `
    <tr>
        <td>${aluno.id}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.dataNasc}</td>
        <td>${aluno.curso}</td>
        <td>${aluno.anoCurso}</td>
        <td>${aluno.instrumento}</td>
    </tr>
    `

    pagHTML +=
                        `
                    </table>
                </div>

                <footer class="w3-container w3-purple">
                    <h5>TPC2 de EngWeb2025 - ${data}</h5>
                </footer>
            </div>
        </body>
    </html>  
    `

    return pagHTML
}

export function genCursoPage(curso, alunos, data) {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Escola de Música</title>        
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h1>Perfil de Curso</h1>
                </header>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>Id</th>
                            <th>Designação</th>
                            <th>Duração</th>
                            <th>Instrumento</th>
                        </tr>
                        <tr>
                            <td>${curso.id}</td>
                            <td>${curso.designacao}</td>
                            <td>${curso.duracao}</td>
                            <td><a href="/instrumentos/${curso.instrumento.id}">${curso.instrumento["#text"]}</a></td>
                        </tr>
                    </table>
                </div>

                <br>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <th>Id do Aluno</th>
                        <th>Nome do Aluno</th>
                        `
    

    
    alunos.forEach(aluno => {
        pagHTML += 
        `
        <tr>
            <td><a href="/alunos/${aluno.id}">${aluno.id}</a></td>
            <td>${aluno.nome}</td>
        </tr>                
        `
    });                    

    pagHTML +=                  
                    `
                        </table>
                </div>

                <footer class="w3-container w3-purple">
                    <h5>TPC2 de EngWeb2025 - ${data}</h5>
                </footer>
            </div>
        </body>
    </html>  
    `

    return pagHTML
}

export function genInstrumentoPage(instrumento, alunos, data) {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Escola de Música</title>        
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h1>Perfil de Instrumento</h1>
                </header>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                        </tr>
                        <tr>
                            <td>${instrumento.id}</td>
                            <td>${instrumento["#text"]}</td>
                        </tr>
                    </table>
                </div>

                <br>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <th>Id do Aluno</th>
                        <th>Nome do Aluno</th>

                        `

    alunos.forEach(aluno => {
        pagHTML += 
        `
        <tr>
            <td><a href="/alunos/${aluno.id}">${aluno.id}</a></td>
            <td>${aluno.nome}</td>
        </tr>                
        `
    });  

    pagHTML +=
                        `
                    </table>
                </div>

                <footer class="w3-container w3-purple">
                    <h5>TPC2 de EngWeb2025 - ${data}</h5>
                </footer>
            </div>
        </body>
    </html>  
    `

    return pagHTML
}