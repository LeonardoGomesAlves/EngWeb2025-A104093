const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const User = require('../models/user')
const Item = require('../controllers/items');
const jwt = require('jsonwebtoken')
const Noticia = require('../controllers/noticias')
const Comment = require('../controllers/comment')
const logger = require('../utils/logger')

const { validateDoc } =  require('../auth/auth');

router.use(validateDoc);

router.get('/users', async function(req, res) {
    try {
      const users = await UserController.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
router.delete('/users/:id', async function(req, res) {
  try {
    let token = req.get('Authorization');
    token = token.split(' ')[1];

    const user = jwt.verify(token, 'EngWeb2025');

    if (req.params.id === user.username) {
      return res.status(400).json({ error: 'Não podes eliminar a tua própria conta' });
    }

    const itemsFromUser = await Item.getByUserIdBySameUser(req.params.id)

    const commentsFromUser = await Comment.getCommentsFromUser(req.params.id);

    for (const item of itemsFromUser) {
      await Item.delete(item._id)
    }

    for (const comment of commentsFromUser) {
      await Comment.deleteById(comment._id);
    }

    await UserController.deleteUser(req.params.id);
    res.json({ message: 'Utilizador eliminado com sucesso' });
    logger.info(`Utilizador ${req.params.id} eliminado com sucesso.`)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
router.put('/users/:id', async function(req, res) {
  try {

    let token = req.get('Authorization')
    if (token) {
      token = token.split(' ')[1];
    }

    let user = jwt.verify(token, 'EngWeb2025')

    if (req.params.id === user.username) {
      return res.status(400).json({ error: 'Não podes editar a tua própria conta' });
    }

    const updatedUser = await UserController.updateUser(req.params.id, req.body);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    res.json({ 
      message: 'Utilizador atualizado com sucesso',
      user: updatedUser 
    });
    logger.info(`Utilizador ${req.params.id} editado com sucesso.`)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users/register', async function (req, res) {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username já existe' });
    }

    User.register(
        new User({
            username : req.body.username,
            email : req.body.email,
            name : req.body.name,
            level : req.body.level,
            creationDate : new Date()
        }),
        req.body.password,
        (err, user) => {
            if(err) {
              res.status(500).json({ error: err.message });
            } else {
              res.json({ message: 'Utilizador criado com sucesso' });
            }
        }
    );
    logger.info(`Utilizador ${req.params.id} criado com sucesso.`)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  

// RECURSOS
router.get('/items', async function(req, res) {
  try {
    const items = await Item.findAllPublic();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
router.delete('/items/:id', async function(req, res) {
  try {
    const item = await Item.delete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    res.json({ message: 'Item eliminado com sucesso' });
    logger.info(`Item ${req.params.id} eliminado com sucesso.`)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/noticias/:id', async function(req, res) {
  try {
    const news = await Noticia.getById(req.params.id);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NOTICIAS
router.get('/noticias', async function(req, res) {
  try {
    const news = await Noticia.getAll();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.post('/noticias', async function(req, res) {
  try {
    console.log(req.body)
    const news = await Noticia.create(req.body);
    res.json({ message: 'Notícia criada com sucesso', news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/noticias/:id', async function(req, res) {
  try {
    const news = await Noticia.update(req.params.id, req.body);
    if (!news) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }
    res.json({ message: 'Notícia atualizada com sucesso', news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/noticias/:id', async function(req, res) {
  try {
    const news = await Noticia.delete(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }
    res.json({ message: 'Notícia eliminada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// ESTATÍSTICAS
router.get('/stats', async function(req, res) {
  try {
    const totalUsers = await UserController.countDocuments();
    const totalItems = await Item.countDocuments();
    const publicItems = await Item.countDocumentsPublic();
    const privateItems = await Item.countDocumentsPrivate();
    const totalNoticias = await Noticia.countDocuments();
    const { totalViews, totalDownloads } = await Item.getTotalStats();
    const topViewed = await Item.getTopViewed(5);
    const topDownloaded = await Item.getTopDownloaded(5);

    res.json({
      totalUsers,
      totalItems,
      publicItems,
      privateItems,
      totalNoticias,
      totalViews,
      totalDownloads,
      topViewed,
      topDownloaded
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router