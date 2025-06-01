var express = require('express');
var router = express.Router();
var Items = require('../controllers/items')
var Likes = require('../controllers/likes')
var multer = require('multer')
var jszip = require('jszip')
var fs = require('fs')
var path = require('path')
const { v4: uuidv4 } = require('uuid');
const auth = require('../auth/auth')
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger')

const tipos = [
    "viagem",
    "desporto",
    "vida pessoal",
    "arte & design",
    "tecnologia",
    "humor"
  ]
  
  const classificadores = [
    "desporto",
    "corrida",
    "outdoor",
    "caminhada",
    "gaming",
    "programação",
    "cinema & séries",
    "pets",
    "sketches / desenhos",
    "arquitetura",
    "memes",
    "humor académico",
    "inteligência artificial",
    "notícias tech"
  ]

var upload = multer({dest: 'upload/'})

/* GET items listing (public and from the user). */
router.get('/', auth.validate, function(req, res, next) {
    var token = req.get('Authorization');
    token = token.split(' ')[1]

    var utilizador = jwt.verify(token, 'EngWeb2025');
    Items.findAllForUsers(utilizador.username, req.query)
        .then(data => res.status(200).jsonp(data))
        .catch(err => res.status(500).jsonp(err))
});

/* GET public items (it has support for string queries) */
router.get('/public', function(req, res, next) {
    Items.getPublicItems(req.query)
        .then(data => res.status(200).jsonp(data))
        .catch(err => res.status(500).jsonp(err))
})

/* GET item by id */
router.get('/:id', async function(req, res, next) {
    try {
        let username = null;
        let token = req.get("Authorization");
        token = token.split(' ')[1];
        let hasLiked = false;
        
        if (token && token !== 'undefined') {
            const user = jwt.verify(token, "EngWeb2025");
            username = user.username;
            hasLiked = await Likes.hasUserLiked(req.params.id, username);
        }

        const data = await Items.findById(req.params.id);
        data.hasLiked = hasLiked;    
        
        if (!data) {
            return res.status(404).jsonp({err : "Item não encontrado"});
        }


        if (data.visible) {
            await Items.incrementViews(req.params.id)
            return res.status(200).jsonp(data);
        } else {
            if (username && username === data.user_id) {
                await Items.incrementViews(req.params.id)
                return res.status(200).jsonp(data);
            } else {
                return res.status(403).jsonp({err : "Não tem permissão para aceder a esse item"});
            }
        }

    } catch (err) {
        console.error(err);
        res.status(500).jsonp({err : "Erro interno do servidor"});
    }
});

/* GET items by user_id */
router.get('/user/:user_id', function(req, res, next) {
    var token = req.get('Authorization')
    token = token.split(' ')[1]

    if (token !== 'undefined') {
        const utilizador = jwt.verify(token, 'EngWeb2025')
        if (utilizador.username == req.params.user_id) {
            Items.getByUserIdBySameUser(req.params.user_id, req.query)
            .then(data => res.status(200).jsonp(data))
            .catch(err => res.status(500).jsonp(err))
        } else {
            Items.getByUserId(req.params.user_id, req.query)
            .then(data => res.status(200).jsonp(data))
            .catch(err => res.status(500).jsonp(err))
        }
    } else {
        Items.getByUserId(req.params.user_id, req.query)
            .then(data => res.status(200).jsonp(data))
            .catch(err => res.status(500).jsonp(err))
    }

})

/* GET export of an AIP, so it's a DIP!!! */
router.get('/:id/export', auth.validate, async function(req, res, next) {
    try {

        let token = req.get('Authorization');
        if (!token) {
            return res.status(401).json({ erro: "Token de autenticação não fornecido" });
        }
        token = token.split(' ')[1];
        const user = jwt.verify(token, 'EngWeb2025');

        const item = await Items.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ erro: "Item não encontrado" });
        }

        await Items.incrementDownloads(req.params.id);

        const zipBuffer = await Items.export(req.params.id)
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="dip-${req.params.id}.zip"`
        })
        res.send(zipBuffer)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

router.get('/:id/likes', async function(req, res, next) {
    Likes.getLikesForItem(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(err => res.status(500).jsonp(err))
});

router.post('/:id/toggleLike', auth.validate, function(req, res, next) {
    const token = req.get('Authorization').split(' ')[1];
    const user = jwt.verify(token, 'EngWeb2025');
    Likes.toggleLike(req.params.id, user.username)
        .then(data => res.status(200).jsonp(data))
        .catch(err => res.status(500).jsonp(err))
});

/* PUT edit visibility of an item */
router.put('/:id/visibility', auth.validate, async function(req, res) {
    try {
        const token = req.get('Authorization').split(' ')[1];
        const user = jwt.verify(token, 'EngWeb2025');
        
        const result = await Items.changeVisibility(user.username, req.params.id, req.body.visible);
        
        res.status(200).jsonp(result);
    } catch (err) {        
        res.status(500).jsonp({ error: err.message });
    }
});

/* POST upload SIP */
router.post('/upload', auth.validate, upload.single('file'), async function(req, res, next) {
    try {
        var token = req.get('Authorization');
        token = token.split(' ')[1]

        var utilizador = jwt.verify(token, 'EngWeb2025');
        var oldPath = __dirname + '/../' + req.file.path

        var zipData = fs.readFileSync(oldPath)
        const zip = await jszip.loadAsync(zipData)

        const manifestoFile = zip.file('manifesto-SIP.json')
        if (!manifestoFile) {
            logger.error(`Erro ao guardar SIP. Manifesto-SIP não existe.`)
            return res.status(400).json({ erro: "Ficheiro manifesto-SIP.json não encontrado no ZIP." })
        }

        const jsoncontent = await manifestoFile.async('string')
        const manifest = JSON.parse(jsoncontent)

        if (!manifest.tipo) {
            logger.error(`Erro ao guardar SIP. Campo tipo é obrigatório.`)
            return res.status(400).json({ erro: "Campo 'tipo' é obrigatório no manifesto." });
        }
        
        const tipoNormalizado = manifest.tipo.toLowerCase();
        const tiposValidos = tipos.map(t => t.toLowerCase());
        
        if (!tiposValidos.includes(tipoNormalizado)) {
            logger.error(`Erro ao guardar SIP. Tipo inválido.`)
            return res.status(400).json({ 
                erro: `Tipo '${manifest.tipo}' não é válido. Tipos permitidos: ${tipos.join(', ')}` 
            });
        }

        if (manifest.classificadores && Array.isArray(manifest.classificadores)) {
            const classificadoresValidos = classificadores.map(c => c.toLowerCase());
            const classificadoresInvalidos = [];
            
            manifest.classificadores.forEach(classificador => {
                const classificadorNormalizado = classificador.toLowerCase();
                if (!classificadoresValidos.includes(classificadorNormalizado)) {
                    classificadoresInvalidos.push(classificador);
                }
            });
            
            if (classificadoresInvalidos.length > 0) {
                logger.error(`Erro ao guardar SIP. Classificadores inválidos.`)
                return res.status(400).json({ 
                    erro: `Classificadores inválidos: ${classificadoresInvalidos.join(', ')}. Classificadores permitidos: ${classificadores.join(', ')}` 
                });
            }
        }

        if (!manifest.titulo || !manifest.descricao) {
            logger.error(`Erro ao guardar SIP. Falta de título ou descrição.`)
            return res.status(400).json({ erro: "Campos 'titulo' e 'descricao' são obrigatórios no manifesto." });
        }

        let elementosEmFalta = []
        manifest.ficheiros.forEach(element => {
            if (!zip.file(element)){
                elementosEmFalta.push(element)
            }
        });

        if (elementosEmFalta.length > 0) {
            logger.error(`Erro ao guardar SIP. Ficheiros não encontrados.`)
            return res.status(400).json({ erro: `Ficheiros não encontrados: ${elementosEmFalta.join(', ')}` });
        }

        const itemId = uuidv4();
        const destino = path.join(__dirname, '..', 'repository', itemId);
        fs.mkdirSync(destino, { recursive: true });

        let ficheirosGuardados = [];

        for (const element of manifest.ficheiros) {
            const ficheiro = zip.file(element);
            const buffer = await ficheiro.async('nodebuffer');
            const destinoFicheiro = path.join(destino, element)

            fs.mkdirSync(path.dirname(destinoFicheiro), { recursive: true })

            fs.writeFileSync(destinoFicheiro, buffer);
            ficheirosGuardados.push(`/repository/${itemId}/${element}`);
        }
        
        const novoItem = {
            ...manifest,
            tipo: tipoNormalizado, // Guardar sempre em minúsculas
            classificadores: manifest.classificadores ? 
            manifest.classificadores.map(c => c.toLowerCase()) : [], // Normalizar classificadores
            user_id: utilizador.username,
            ficheiros: ficheirosGuardados,
            visible: manifest.visible ?? false,
            dataSubmissao: new Date(),
            _id: itemId
        }

        const novoLike = {
            item_id: itemId,
            total_likes: 0,
            user_ids: [],
            createdAt: new Date()
        }

        await Likes.save(novoLike);
        await Items.save(novoItem);
        
        fs.unlinkSync(oldPath);
        
        res.status(200).json({ 
            mensagem: "Upload e processamento concluídos com sucesso!", 
            item: novoItem 
        });

        logger.info(`Item ${itemId} guardado com sucesso`);

    } catch (err) {
        if (req.file && fs.existsSync(__dirname + '/../' + req.file.path)) {
            fs.unlinkSync(__dirname + '/../' + req.file.path);
        }
        
        console.error('Erro no upload SIP:', err);
        res.status(500).json({ erro: "Erro ao processar o upload: " + err.message })
    }
});

/* PUT update an existing (now) AIP, but only json fields */
router.put('/:id', auth.validate, function(req, res, next) {
    Items.update(req.params.id, req.body)
        .then(data => res.status(200).jsonp(data))
        .catch(err => res.status(500).jsonp(err))
})

/* DELETE delete an AIP, in the database and in the repository folder */
router.delete('/:id', auth.validate, async function(req, res, next) {
    try {
        const token = req.get('Authorization').split(' ')[1];
        const user = jwt.verify(token, 'EngWeb2025');
        
        // Buscar o item para verificar o dono
        const item = await Items.findById(req.params.id);
        if (!item) {
            logger.error(`Item não encontrado.`)
            return res.status(404).jsonp({ erro: "Item não encontrado" });
        }
        
        // Verificar se o utilizador é o dono
        if (item.user_id !== user.username) {
            logger.error(`Erro ao eliminar item. Utilizador não tem permissões.`)
            return res.status(403).jsonp({ erro: "Não tem permissão para eliminar este item" });
        }
        
        // Eliminar o item
        const data = await Items.delete(req.params.id);
        res.status(200).jsonp({ 
            success: true, 
            message: "Item eliminado com sucesso",
            data: data 
        });

        logger.info(`Item ${req.params.id} removido com sucesso.`)
        
    } catch (err) {
        logger.error(`Erro ao eliminar item.`)
        console.error('Erro ao eliminar item:', err);
        res.status(500).jsonp({ erro: "Erro interno do servidor: " + err.message });
    }
});

module.exports = router;
