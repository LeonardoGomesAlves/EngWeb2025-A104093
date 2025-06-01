# EngWeb2025-Projeto

## Introdução
Este projeto implementa um Diário Pessoal Digital baseado nos padrões OAIS, desenvolvido no âmbito da unidade curricular de Engenharia Web. A aplicação permite a criação, gestão e partilha de entradas pessoais através de um sistema completo de ingestão (SIP), arquivo (AIP) e disseminação (DIP). 
A nossa implementação é bastante similar a uma rede social pelo que, existe a possibilidade de interagir com as publicações de outros utilizadores.

## Funcionalidades implementadas
### Autenticação
- Login tradicional (username/password);
- OAuth Google e Facebook;
- Sistema JWT para sessões;
- Sistema baseado em níveis de acesso (user/admin).

### Gestão de Conteúdos/Itens
- Tipos de Item: Desporto, Atividades, Viagens, etc..
- Classificadores: Classificadores, funcionam como uma **hashtag**;
- Visibilidade: Conteúdo público/privado por item (backoffice ou público);
- Timeline: Organização cronológica como navegação base, ou seja, são apresentados em primeiro lugar os itens que foram carregados no sistema recentemente.

### Ingestão de itens (SIP)
- Upload de pacotes ZIP com manifesto JSON;
- Opcionalmente, os utilizadores poderão criar um próprio SIP através de um formulário que criará um ficheiro ZIP com a estrutura normal dos SIP;
- Validação automática da estrutura do SIP.

### Exportação de itens (DIP)
- Interface web responsiva de cada um dos itens;
- Exportação ZIP de itens;
- Partilha em redes sociais.

### Administração
- Gestão de utilizadores;
- CRUD completo dos itens;
- Sistema de avisos para os utilizadores;
- Estatísticas de utilização (views/downloads).


## Implementação
No seguinte capítulo iremos apresentar os principais endpoints do backend e frontend.

### Backend/API
- `/api/users/change-password`: Alterar password do utilizador.
- `/api/items/upload`: Carregar novo item.
- `/api/items/:id`: Obter item pelo ID.
- `/api/items/:id/delete`: Eliminar item, bem como likes e comentários associados a ele.
- `/api/comments/upload`: Carregar comentário.
- `/api/comments/item/:id`: Obter comentários por item.
- `/api/admin/stats`: Obter estatísticas de admin.

### Frontend
- `/login`: Página de login de utilizador.
- `/register`: Página de registo de utilizador.
- `/profile/:id`: Página de perfil de utilizador.
- `/item/:id`: Página de detalhes do item.
- `/item/:id/export`: Exportar item.
- `/admin`: Painel de controlo de admin.
- `/admin/users`: Gerir utilizadores.
- `/admin/items`: Gerir itens.
- `/admin/stats`: Ver estatísticas.

### Autenticação
- `/api/users/register`: Registar novo utilizador.
- `/api/users/login`: Login de utilizador.

### Formato do manifesto-SIP.json

De forma a suportar a ingestão conforme os padrões de OAIS, para fazer o correto upload de itens para o sistema, o nosso ficheiro tem que ter a seguinte estrutura:
```
{
    "titulo": "Titulo do Exemplo",
    "tipo": "desporto",
    "descricao": "Descrição sobre o acontecimento",
    "dataCriacao": "2025-05-20",
    "dataSubmissao": "2025-05-21",
    "classificadores": [
        "desporto",
        "corrida",
        "outdoor"
    ],
    "ficheiros": [
        "data/corrida1.jpg",
        "data/data2/teste.txt",
        "data/corrida2.jpg",
        "data/corrida3.jpg"
    ]
}
```

Quanto aos **tipos**, podem ser os seguintes: viagem, desporto,
vida pessoal,
arte & design,
tecnologia,
humor;

Quanto aos **classificadores**, podem ser os seguintes: 
desporto,
corrida,
outdoor,
caminhada,
gaming,
programação,
cinema & séries,
pets,
sketches / desenhos,
arquitetura,
memes,
humor académico,
inteligência artificial,
notícias tech.

Eventualmente, com o crescer da aplicação, podem ser inseridos novos tipos.

### Schemas
**Item**
```
const itemSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    user_id: { type: String, required: true },
    titulo: { type: String, required: true},
    tipo: { type: String, required: true },
    descricao: { type: String },
    dataCriacao: { type: Date, required: true },
    dataSubmissao: { type: Date, default: Date.now },
    visible: { type: Boolean, default: false },
    classificadores: [String],
    ficheiros: [String],
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 }
})
```

**Comment**
```
const commentSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    user_id: { type: String, required: true },
    item_id: { type: String, required: true},
    descricao: { type: String },
    dataSubmissao: { type: Date, default: Date.now },
})
```

**Like**
```
const likeSchema = new mongoose.Schema({
    item_id: { type: String, required: true, unique: true },
    total_likes: { type: Number, default: 0},
    user_ids: [String],
    createdAt: { type: Date, default: Date.now }
});
```

**Noticia**
```
const noticiasSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  data: { type: Date, default: Date.now },
  visible: { type: Boolean, default: true
  }
});
```

**User**
```
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String },
    name: { type: String, required: true },
    level: { type: String, required: true },
    creationDate: { type: Date, required: true },
    facebookId: { type: String },
    googleId: { type: String },
    avatar: {type: String, default: null}
});
```

## Execução da aplicação
Para correr o programa, decidimos utilizar um docker que cria 3 contentores, um para API, outro para a interface e outro para a base de dados.

Pode ser executando correndo um dos seguintes comandos na raiz do projeto.
```
docker-compose up --build
```
**ou**
```
docker compose up --build
```

### Ficheiro .env
Para ser possível executar o programa, é necessário ter dois ficheiros .env:
- Um ficheiro .env na raiz do projeto, de forma a suportar o login com facebook e google, com o seguinte formato, preenchendo com as suas credenciais de dev do Facebook e Google:
```
MONGODB_URI=mongodb://mongodb:27017/diario

JWT_SECRET=EngWeb2025

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:3333/api/users/auth/facebook/callback
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3333/api/users/auth/google/callback

API_PORT=3333
INTERFACE_PORT=3000
MONGODB_PORT=27017

NODE_ENV=production
```

- Outro ficheiro .env na pasta da API de dados, com o seguinte formato e, novamente, preencher com as mesmas informações do outro ficheiro .env:
```
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:3333/api/users/auth/facebook/callback
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3333/api/users/auth/google/callback
```

## Conclusão

Este projeto demonstra a implementação bem-sucedida de um Diário Pessoal Digital seguindo os padrões OAIS, integrando conceitos de preservação digital com funcionalidades modernas de redes sociais. 

Quanto ao trabalho futuro, poderemos fornecer melhores mensagens de feedback, nomeadamente os tipos de erros que acontecem numa certa operação. Por outro lado, poderemos criar novas funcionalidades como a opção de poder seguir pessoas, partilhar itens e enviar mensagens.

Por fim, achámos que fizemos um bom trabalho que cumpra na íntegra todos os requisitos apresentados no enunciado do projeto.
