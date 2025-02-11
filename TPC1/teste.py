import json 
import os 
import shutil

def open_json(filename):
    with open(filename,'r',encoding='utf-8') as file:
        data = json.load(file)
        
        # Use when you have the text and not the file ref
        # fileText ) file.read()
        # data = json.loads(fileText)
        
        return data
    
    
def mk_dir(relative_path):
    if not os.path.exists(relative_path): # create folder  
        os.mkdir(relative_path)
    else:
        shutil.rmtree(relative_path)    # delete folder content
        os.mkdir(relative_path)

def new_file(html):
    f = open('index.html','w',encoding = 'utf-8')
    f.write(html)
    f.close()
        
        
lista_nif = []
lista_matricula = []
json_obj = open_json('dataset_reparacoes.json')

for reparacao in json_obj['reparacoes']:
    nif = reparacao['nif']
    matricula = reparacao['viatura']['matricula']
    if(nif in lista_nif):
        print(f'O nif {nif} já existe')
    else:
        lista_nif.append(nif)
    
    #Verifica Matricula 
    if (matricula in lista_matricula):
        print(f'A matricula {matricula} já existe')
    else:
        lista_matricula.append(matricula)

#lista_reparacoes
""" html = '''
<html>
    <head>
        <title>Reparações</title>
    </head>
    <body>
        <h1>Reparações</h1>
        <ul>
'''

json_obj = open_json('dataset_reparacoes.json')
for reparacao in json_obj['reparacoes']:
    data = reparacao['data']
    nif  = reparacao['nif']
    nome  = reparacao['nome']
    marca  = reparacao['viatura']['marca']
    modelo  = reparacao['viatura']['modelo']
    nr_intervencoes  = reparacao['nr_intervencoes']
    pass

    html += f'<li>{data} || {nif}  || {nome} || {marca} || {modelo} || {nr_intervencoes}</li>'

html+= '''
        </ul>
    </body>
</html>    
''' """

#lista_intervencoes
html = '''
<html>
    <head>
        <title>Intervenções</title>
         <style>
        body {
            background-color: #333; /* Dark gray background */
            color: white; /* Light text color for contrast */
            font-size: 1rem;
        }
        </style>
    </head>
    <body>
        <h1>Intervenções</h1>
        <ul>
'''
map_intervencoes = {}
json_obj = open_json('dataset_reparacoes.json')
for reparacao in json_obj['reparacoes']:
    for intervencao in reparacao['intervencoes']:
        map_intervencoes[intervencao['codigo']] = intervencao

for (codigo) in sorted(map_intervencoes.keys()):
    nome = map_intervencoes[codigo]['nome']
    descricao =  map_intervencoes[codigo]['descricao']
    html += f'<li> {codigo} || {nome} || {descricao} </li>'
    pass

html+= '''
        </ul>
    </body>
</html>    
'''

##

new_file(html)