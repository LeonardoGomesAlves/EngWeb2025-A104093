# TPC1 - A oficina

## Data de realização
15/02/2025

## Autor
**Nome:** Leonardo Gomes Alves - A104093

![115940136](https://github.com/user-attachments/assets/68bdbc41-86fd-4a82-91ad-d08d2e9787ac)

## Resumo

### Enunciado do problema

Construir um serviço em nodejs, que consuma a API de dados servida pelo json-server da oficina de reparações e responda com as páginas web do site.

### Resolução do problema

Para construir o serviço em nodejs, comecei por realizar alterações necessárias no dataset fornecido (`dataset_reparacoes.json`, após mudanças denominado por `dataset_final.json`), possiblitando desta forma existir várias relações entre as várias páginas web, para tal, foi criado o script `json_changer.py`. Assim, bastou-me criar as páginas utilizando Javascript com HTML e CSS para obter o resultado final.

### Exemplo da compilação do serviço

### Alterar o dataset
```
$ python3 json_changer.py
```

### Inicializar o json-server
```
$ json-server --watch dataset_final.json
```

### Inicializar o serviço nodejs
```
$ node server.js
```

### Resultados
O servidor é alocado na porta 1234. 

Cada uma das páginas, à exceção da página inicial, é composta por um botão verde, localizado no canto superior direito, responsável por voltar à página inicial (endpoint `/`). 

### Mudanças no dataset
Relativamente ao dataset inicial fornecido pela equipa docente, ao longo do processo de desenvolvimento, foram realizadas algumas alterações.

Foram criados 3 objetos: 
 - Viatura
   <pre>
   "viaturas": [
        {
            "id": 1,
            "matricula": "10-EB-81",
            "marca": "Lada",
            "modelo": "YV 198",
            "reparacoes_ids": [
                1
            ],
            "n_reparacoes": 1
        } ...
     ]
   </pre>
   Inserido o `id`, gerado automaticamento pelo `json_changer.py`, útil para navegar para um endpoint de uma certa viatura;

   Criação da lista `reparacoes_ids`, composta pelos identificadores das reparações efetuadas pela oficina nessa viatura;

   Inserida a variável `n_reparacoes`, que corresponde ao tamanho da lista `reparacoes_ids`.
   
 - Intervencoes
     <pre>
    "intervencoes": [
      {
          "nome": "Serviço de transmissão",
          "descricao": "Substituição do fluido da transmissão, ajuste ou reparação de componentes da transmissão.",
          "id": "R024",
          "n_reparacoes": 1311,
          "reparacoes_ids": [
              1,
              10,
              13,
              16 ...
         ]
     }
   ]
    </pre>
   Inserido o `id`, gerado automaticamento pelo `json_changer.py`, útil para navegar para um endpoint de uma certa intervenção;

   Criação da lista `reparacoes_ids`, composta pelos identificadores das reparações efetuadas pela oficina que necessitaram dessa intervenção;
   
   Inserida a variável `n_reparacoes`, que corresponde ao tamanho da lista `reparacoes_ids`.
   
 - Marcas
    <pre>
      "marcas": [
          {
              "id": 1,
              "nome": "Lada",
              "viaturas": [
                  {
                      "matricula": "10-EB-81",
                      "id_viatura": 1
                  },
                  {
                      "matricula": "7-KJ-88",
                      "id_viatura": 113
                  } ...
             ]
          }
      ]
    </pre>
    
    Inserido o `id`, gerado automaticamento pelo `json_changer.py`, útil para navegar para um endpoint de uma certa marca;
  
    Criação da lista `viaturas`, composta pelos identificadores e matrículas das viaturas que já foram reparadas na oficina dessa mesma marca.



Para além destas adições, o objeto reparações sofreu ainda as seguintes alterações:
<pre>
  "reparacoes": [
        {
            "nome": "Dálio Pardal",
            "nif": 8210436,
            "data": "2021-12-04",
            "viatura": {
                "id": 1,
                "matricula": "10-EB-81"
            },
            "nr_intervencoes": 1,
            "intervencoes": [
                {
                    "nome": "Serviço de transmissão",
                    "id": "R024"
                }
            ],
            "id": 1
        } ...
  ]
</pre>


### Páginas


#### Página Inicial
Acedida através do endpoint `/`, a página inicial apresenta a listagem das várias "entidades" do json-server.
![image](https://github.com/user-attachments/assets/b47a5aec-5237-4462-8d2b-9f0d3cb14740)

#### Lista de Reparações
Acedida através do endpoint `/reparacoes`, esta página apresenta todas as reparações efetuadas pela oficina organizadas de forma crescente pelo seu id. Cada reparação possuí uma hiperligação para a sua própria página.
![image](https://github.com/user-attachments/assets/78bb7f18-6008-4a69-9861-e4df87c8b065)

#### Reparação
Acedida através do endpoint `/reparacoes/{id}`, onde id corresponde ao id da reparação, esta página apresenta os dados da reparação, onde existe uma hiperligação para a viatura e para cada uma das intervenções realizadas nessa reparação.
![image](https://github.com/user-attachments/assets/e2749c09-01ea-48fd-bf45-33c66b63a45d)

#### Lista de Intervenções
Acedida através do endpoint `/intervencoes`, esta página apresenta todas as intervenções que podem ser efetuadas pela oficida organizadas de forma crescente pelo seu id. Cada intervenção possuí uma hiperligação para a sua própria página.
![image](https://github.com/user-attachments/assets/74c82682-5309-4df9-9f94-59ac594fb9e1)

#### Intervenção
Acedida através do endpoint `/intervencoes/{id}`, onde id corresponde ao id da intervenção, esta página apresenta os dados de uma intervenção, onde existem hiperligações para cada uma das reparações que necessitaram dessa intervenção.
![image](https://github.com/user-attachments/assets/dcdd33e0-68a7-4d07-8650-f1e3f67bec71)

#### Lista de Marcas
Acedida através do endpoint `/marcas`, esta página apresenta todas as marcas de veículos que já foram reparados pela oficina organizadas de forma alfabética. Cada marca possuí uma hiperligação para a sua própria página.
![image](https://github.com/user-attachments/assets/4bfac4c5-db0f-4ca8-8d9d-f9aed36eabfc)

#### Marca
Acedida através do endpoint `/marcas/{id}`, onde id corresponde ao id da marca, esta página apresenta uma lista das matrículas dos veículos que já foram reparados pela oficina. Cada matrícula possui uma hiperligação para a página do veículo correspondente.
![image](https://github.com/user-attachments/assets/32c8dc35-eb9e-4f0e-a101-27d9770ca408)

#### Lista de Viaturas
Acedida através do endpoint `/viaturas`, esta página apresenta todas uma lista das matrículas de todos os veículos que já foram reparados pela oficina. Cada matrícula possui uma hiperligação para a página do veículo correspondente.
![image](https://github.com/user-attachments/assets/cd9fa157-bbbf-4a41-8251-e76becf10990)

#### Viatura
Acedida através do endpoint `/viaturas/{id}`, onde id corresponde ao id da viatura, esta página apresenta os dados de um veículo, onde existem hiperligações para cada uma das reparações que já foram efetuadas no mesmo.
![image](https://github.com/user-attachments/assets/b665ae5a-86f9-4ae5-baf0-c74d356605e2)



