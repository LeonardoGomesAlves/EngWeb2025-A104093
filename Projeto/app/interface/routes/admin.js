// app/interface/routes/admin.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

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

const requireAdmin = (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.redirect('/login');
      }
  
      const user = jwt.verify(token, 'EngWeb2025');
      if (user.level !== 'admin') {
        return res.status(403).render('error', { 
          message: 'Acesso negado. Apenas administradores.',
          error: { status: 403 }
        });
      }  
      next();
    } catch (error) {
      res.redirect('/login');
    }
  };

router.use(requireAdmin);

router.get('/', async function(req, res) {
  try {
    const token = req.cookies.token;
    
    const stats = await axios.get('http://api:3333/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    res.render('admin/dashboard', {
      title: 'Painel de Administração',
      stats: stats.data
    });
  } catch (error) {
    res.render('error', { error, message: 'Erro ao carregar dashboard' });
  }
});

router.get('/users', async function(req, res) {
  try {


    const token = req.cookies.token;
    
    const users = await axios.get('http://api:3333/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    res.render('admin/users', {
      title: 'Gestão de Utilizadores',
      users: users.data,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    res.render('error', { error, message: 'Erro ao carregar utilizadores' });
  }
});

router.get('/users/create', function(req, res) {
  res.render('admin/user-form', {
    title: 'Criar Utilizador',
    user: null,
    error: req.query.error
  });
});

router.post('/users/create', async function(req, res) {
  try {
    const token = req.cookies.token;
    await axios.post('http://api:3333/api/admin/users/register', req.body, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.redirect('/admin/users?success=user_created');
  } catch (error) {
    res.redirect('/admin/users/create?error=create_failed');
  }
});

router.get('/users/:id/edit', async function(req, res) {
  try {
    const token = req.cookies.token;
    const user = await axios.get(`http://api:3333/api/users/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(user)

    res.render('admin/user-form', {
      title: 'Editar Utilizador',
      user: user.data,
      error: req.query.error
    });
  } catch (error) {
    res.redirect('/admin/users?error=user_not_found');
  }
});

router.post('/users/:id/edit', async function(req, res) {
  try {
    const token = req.cookies.token;
    await axios.put(`http://api:3333/api/admin/users/${req.params.id}`, req.body, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.redirect('/admin/users?success=user_updated');
  } catch (error) {
    res.redirect(`/admin/users/${req.params.id}/edit?error=update_failed`);
  }
});

router.post('/users/:id/delete', async function(req, res) {
  try {
    const token = req.cookies.token;
    await axios.delete(`http://api:3333/api/admin/users/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.redirect('/admin/users?success=user_deleted');
  } catch (error) {
    res.redirect('/admin/users?error=delete_failed');
  }
});


router.get('/items', async function(req, res) {
  try {
    const token = req.cookies.token;
    const items = await axios.get('http://api:3333/api/admin/items', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    res.render('admin/items', {
      title: 'Gestão de itens',
      items: items.data,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    res.render('error', { error, message: 'Erro ao carregar recursos' });
  }
});

router.post('/items/:id/delete', async function(req, res) {
  try {
    const token = req.cookies.token;
    await axios.delete(`http://api:3333/api/admin/items/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.redirect('/admin/items?success=item_deleted');
  } catch (error) {
    res.redirect('/admin/items?error=delete_failed');
  }
});

router.get('/items/:id/edit', async function(req, res) {
  try {
    const token = req.cookies.token;
    const item = await axios.get(`http://api:3333/api/items/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    res.render('admin/item-form', {
      title: 'Editar item',
      item: item.data,
      error: req.query.error,
      tipos: tipos,
      classificadores: classificadores
    });
  } catch (error) {
    res.redirect('/admin/items?error=item_not_found');
  }
});

router.post('/items/:id/edit', async function(req, res) {
  try {
    const token = req.cookies.token;
    await axios.put(`http://api:3333/api/items/${req.params.id}`, req.body, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.redirect('/admin/items?success=item_updated');
  } catch (error) {
    res.redirect(`/admin/items/${req.params.id}/edit?error=update_failed`);
  }
});


// noticias
router.get('/noticias', async function(req, res) {
  try {
    const token = req.cookies.token;
    const noticias = await axios.get('http://api:3333/api/admin/noticias', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    res.render('admin/noticias', {
      title: 'Gestão de notícias',
      noticias: noticias.data,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    res.render('error', { error, message: 'Erro ao carregar notícias' });
  }
});

router.get('/noticias/create', function(req, res) {
  res.render('admin/noticia-form', {
    title: 'Criar notícia',
    noticia: null,
    error: req.query.error
  });
});

router.post('/noticias/create', async function(req, res) {
  try {
    const token = req.cookies.token;
    await axios.post('http://api:3333/api/admin/noticias', req.body, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.redirect('/admin/noticias?success=noticia_created');
  } catch (error) {
    res.redirect('/admin/noticias/create?error=create_failed');
  }
});

router.get('/noticias/:id/edit', async function(req, res) {
  try {
    const token = req.cookies.token;
    let noticia = await axios.get(`http://api:3333/api/admin/noticias/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    noticia = noticia.data
    
    if (!noticia) {
      return res.redirect('/admin/noticias?error=noticia_not_found');
    }

    res.render('admin/noticia-form', {
      title: 'Editar notícia',
      noticia: noticia,
      error: req.query.error
    });
  } catch (error) {
    res.redirect('/admin/noticias?error=noticia_not_found');
  }
});

router.post('/noticias/:id/edit', async function(req, res) {
  try {
    const token = req.cookies.token;
    await axios.put(`http://api:3333/api/admin/noticias/${req.params.id}`, req.body, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.redirect('/admin/noticias?success=noticia_updated');
  } catch (error) {
    res.redirect(`/admin/noticias/${req.params.id}/edit?error=update_failed`);
  }
});

router.post('/noticias/:id/toggle', async function(req, res) {
  try {
    const token = req.cookies.token;
    
    let noticia = await axios.get(`http://api:3333/api/admin/noticias/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    noticia = noticia.data;
    
    if (!noticia) {
      return res.redirect('/admin/noticias?error=noticia_not_found');
    }

    await axios.put(`http://api:3333/api/admin/noticias/${req.params.id}`, {
      visible: !noticia.visible
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    res.redirect('/admin/noticias?success=visibility_toggled');
  } catch (error) {
    res.redirect('/admin/noticias?error=toggle_failed');
  }
});


router.post('/noticias/:id/delete', async function(req, res) {
  try {
    const token = req.cookies.token;
    await axios.delete(`http://api:3333/api/admin/noticias/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.redirect('/admin/noticias?success=noticia_deleted');
  } catch (error) {
    res.redirect('/admin/noticias?error=delete_failed');
  }
});

// ESTATÍSTICAS
router.get('/stats', async function(req, res) {
  try {
    const token = req.cookies.token;
    const stats = await axios.get('http://api:3333/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    res.render('admin/stats', {
      title: 'Estatísticas de utilização',
      stats: stats.data
    });
  } catch (error) {
    res.render('error', { error, message: 'Erro ao carregar estatísticas' });
  }
});

module.exports = router;