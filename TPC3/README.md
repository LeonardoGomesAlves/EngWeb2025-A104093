# TPC3

## Data de realização
05/03/2025

## Autor
**Nome:** Leonardo Gomes Alves - A104093

![115940136](https://github.com/user-attachments/assets/68bdbc41-86fd-4a82-91ad-d08d2e9787ac)

## Resumo

### Enunciado do problema

Construir um serviço em nodejs, que consuma a API de dados servida pelo json-server dum dataset de estudantes e sirva um website.


### Resolução do problema

Para a resolução deste problema, uma vez que nos foram fornecidos os templates das páginas, apenas fui responsável por fazer o correto encaminhamento e funcionamento em cada um das páginas. Este desenvolvimento foi realizado no ficheiro **<a href="https://github.com/LeonardoGomesAlves/EngWeb2025-A104093/blob/main/TPC3/alunos_server_skeleton.js">alunos_server_skeleton.js</a>**.

### Exemplo da compilação do serviço
#### Inicializar o json-server
```
$ json-server --w alunos.json
```

#### Inicializar o serviço nodejs
```
$ node alunos_server_skeleton.js
```

### Resultados
O servidor web é alocado na porta 7777 e o json-server na porta 3000.  

### Páginas

#### Página Inicial
Acedida através do endpoint `/`, a página inicial apresenta uma tabela com alunos,  onde existem hiperligações para o perfil e Git Link de cada um dos alunos. 
É composto ainda por um botão de Edit, para editar as informações do aluno, e um botão de Delete, para apagar o aluno do nosso sistema.

![image](https://github.com/user-attachments/assets/9e4044e6-91f4-4ff4-99ed-6c1375f6fbd0)


#### Perfil de aluno
Acedida através do endpoint `/alunos/{id}`, onde id corresponde ao número do aluno, esta página apresenta o perfil dum aluno com as suas respectivas características.

![image](https://github.com/user-attachments/assets/dc38c633-2858-4198-86bc-98108ce331fa)


#### Edição de aluno
Acedida através do endpoint `/alunos/edit/{id}`, onde id corresponde ao número do aluno, esta página é composta por um formulário de edição desse aluno.

![image](https://github.com/user-attachments/assets/b6dff122-65bd-412e-86c4-39698d9ae18b)


## Conclusão

O desenvolvimento deste serviço em permitiu a criação de um website funcional para o dataset sobre alunos, atendendo aos requisitos fornecidos no enunciado. 

O sistema possui ainda, no footer, uma hiperligação que nos redireciona para a página inicial (endpoint `\`). 
