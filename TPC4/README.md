
# TPC4

## Data de realização
11/03/2025

## Autor
**Nome:** Leonardo Gomes Alves - A104093

![115940136](https://github.com/user-attachments/assets/68bdbc41-86fd-4a82-91ad-d08d2e9787ac)

## Resumo

### Enunciado do problema

Construir um serviço em nodejs, que consuma a API de dados servida pelo json-server dum dataset de filmes e sirva um website, utilizado express e pug, com as seguintes caraterísticas:

 1. Opção de editar e remover filmes do sistema;
 2. Apresentar para cada ator a lista de filmes que estes participam.


### Resolução do problema

Para a resolução deste problema, de forma a facilitar o acesso aos filmes no json-server, optei por adicionar o campo identificador em cada um destes, utilizando o ficheiro **<a href="https://github.com/LeonardoGomesAlves/EngWeb2025-A104093/blob/main/TPC4/json_normalizer.py">json_normalizer.py</a>**.

Assim, o ficheiro **<a href="https://github.com/LeonardoGomesAlves/EngWeb2025-A104093/blob/main/TPC4/routes/index.js">/routes/index.js</a>**, atribui a cada uma das páginas do website, o seu respetivo método e a sua página (**/views**).

### Exemplo da compilação do serviço

#### Instalar dependências
```
$ npm i
```

#### Normalizar dataset
```
$ python3 json_normalizer.py
```

#### Inicializar o json-server
```
$ json-server --w cinema_normalized.json
```

#### Inicializar o serviço nodejs
```
$ npm start
```

### Resultados
O servidor web é alocado na porta 2510 e o json-server na porta 3000. 

Cada uma das páginas, à exceção da página inicial, é composta por um botão verde, localizado no canto superior direito, responsável por voltar à página inicial (endpoint `/`). 

### Páginas

#### Página Inicial
Acedida através do endpoint `/`, a página inicial apresenta uma hiperligação para a lista de filmes.

![image](https://github.com/user-attachments/assets/ad788bf7-fbf5-4a4e-8872-ea60f7f86791)


#### Lista de Filmes
Acedida através do endpoint `/filmes`, esta página apresenta uma tabela com todos os filmes guardados no sistema juntamente com as suas informações. Cada um dos atores possuí uma hiperligação para o seu perfil. É possível editar e apagar cada filme.

![image](https://github.com/user-attachments/assets/2d439b5c-f37c-45b6-a733-e7b8c6be826b)

#### Editar Filme
Acedida através do endpoint `/filmes/edit/{id}`, onde id corresponde ao id do filme, esta página um formulário de edição desse filme.

![image](https://github.com/user-attachments/assets/1614fc19-639e-4adf-a984-7c8182216f5d)

#### Lista de filmes de um ator
Acedida através do endpoint `/actor/{actor_name}`, onde actor_name corresponde ao nome dum ator, esta página apresenta uma lista com todos os filmes desse ator guardados no sistema.

![image](https://github.com/user-attachments/assets/dcced109-74e3-491f-93a3-83cc4a9b0081)

## Conclusão

O desenvolvimento deste serviço em permitiu a criação de um website funcional para o dataset sobre filmes, atendendo aos requisitos fornecidos no enunciado. 

O sistema possui ainda, no footer, uma hiperligação que nos redireciona para a página inicial (endpoint `\`). 
