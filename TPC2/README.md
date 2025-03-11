# TPC2 - Escola de Música

## Data de realização
22/02/2025

## Autor
**Nome:** Leonardo Gomes Alves - A104093

![115940136](https://github.com/user-attachments/assets/68bdbc41-86fd-4a82-91ad-d08d2e9787ac)

## Resumo

### Enunciado do problema

Construir um serviço em nodejs, que consuma a API de dados servida pelo json-server da escola de música (implementada na segunda aula teórica) e sirva um website com as seguintes caraterísticas:

  - Página principal: Listar alunos, Listar Cursos, Listar Instrumentos;

  - Página de alunos: Tabela com a informação dos alunos (clicando numa linha deve saltar-se para a página de aluno);

  - Página de cursos: Tabela com a informação dos cursos (clicando numa linha deve saltar-se para a página do curso onde deverá aparecer a lista de alunos a frequentá-lo);

  - Página de instrumentos: Tabela com a informação dos instrumentos (clicando numa linha deve saltar-se para a página do instrumento onde deverá aparecer a lista de alunos que o tocam).

### Resolução do problema

Para a resolução deste problema, uma vez que os datasets já se encontravam normalizados e com as característas necessárias (identificadores) para o desenvolvimento das páginas, bastou desenvolver o código para cada uma das páginas, **<a href="https://github.com/LeonardoGomesAlves/EngWeb2025-A104093/blob/main/TPC2/mypages.js">mypages.js</a>**, que trata apenas de desenvolver a parte de HTML e CSS, utilizado W3.CSS.

Assim, no ficheiro **<a href="https://github.com/LeonardoGomesAlves/EngWeb2025-A104093/blob/main/TPC2/escola_musica-server.js">escola_musica-server.js</a>**, atribui cada uma das páginas anteriores ao seu endpoint correspondente.

### Exemplo da compilação do serviço

### Inicializar o json-server
```
$ json-server --w db.json
```

### Inicializar o serviço nodejs
```
$ node escola_musica-server.js
```

### Resultados
O servidor é alocado na porta 1234. 

Cada uma das páginas, à exceção da página inicial, é composta por um botão verde, localizado no canto superior direito, responsável por voltar à página inicial (endpoint `/`). 

### Páginas

#### Página Inicial
Acedida através do endpoint `/`, a página inicial apresenta a listagem das várias "entidades" requeridas no enunciado (alunos, cursos e instrumentos).

![image](https://github.com/user-attachments/assets/45ae2b16-6d0a-4640-9e9a-b5e5b976ba0a)

#### Lista de Alunos
Acedida através do endpoint `/alunos`, esta página apresenta uma tabela com todos os alunos guardados no sistema juntamente com o seu instrumento. 
Cada linha possuí uma hiperligação para a página desse mesmo aluno.

![image](https://github.com/user-attachments/assets/ed7b5d60-f119-4176-a964-44c4bf38d38c)

#### Perfil de Aluno
Acedida através do endpoint `/alunos/{id}`, onde id corresponde ao id do aluno, esta página apresenta todos os dados relativos a esse aluno.

![image](https://github.com/user-attachments/assets/212f0dd3-23f7-43bf-9edb-a4c45ab351d9)

#### Lista de Cursos
Acedida através do endpoint `/cursos`, esta página apresenta uma tabela com todos os cursos guardados no sistema. 
Cada linha possuí uma hiperligação para a página desse mesmo curso.

![image](https://github.com/user-attachments/assets/cfe72c59-850f-4760-93cc-c765fa7679f6)

#### Perfil de Curso
Acedida através do endpoint `/cursos/{id}`, onde id corresponde ao id do curso, esta página apresenta os dados relativos a esse curso, onde existe uma lista dos alunos que frequentam esse curso e uma hiperligação para a página do instrumento. 
Cada uma das linhas da tabela de alunos, possuí uma hiperligação para a página do aluno.

![image](https://github.com/user-attachments/assets/61b9f43e-18d8-4b04-b47e-85e92f2626a2)

#### Lista de Instrumentos
Acedida através do endpoint `/instrumentos`, esta página apresenta uma tabela com todos os instrumentos guardados no sistema. 
Cada linha possuí uma hiperligação para a página desse mesmo instrumento.

![image](https://github.com/user-attachments/assets/847a56c2-36a9-452c-8225-5b15396f6161)

#### Perfil de Instrumento
Acedida através do endpoint `/instrumentos/{id}`, onde id corresponde ao id do instrumento, esta página apresenta os dados relativos a esse instrumento, onde existe uma lista dos alunos que frequentam esse instrumento. 
Cada uma das linhas da tabela de alunos, possuí uma hiperligação para a página do aluno.

![image](https://github.com/user-attachments/assets/a8a019bf-d760-46ea-963a-a8fec2f967f4)


## Conclusão

O desenvolvimento deste serviço em permitiu a criação de um website funcional para a Escola de Música, atendendo aos requisitos fornecidos no enunciado, garantindo assim a correta organização das informações sobre alunos, cursos e instrumentos. 

O sistema possui ainda, como se pode verificar nos printscreens assim, um botão que nos redireciona para a página inicial (endpoint `\`). 

