var express = require('express');
var router = express.Router();
var index = require('../controllers/index')
var jwt = require('jsonwebtoken');
var multer = require('multer');
var formData = require('form-data')
var fs = require('fs')
const axios =  require('axios')
const jszip = require('jszip')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const { formatTimeAgo, formatTime } = require('../controllers/index');

const upload = multer({ dest: 'uploads/' });

const handleToken = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const user = jwt.verify(token, 'EngWeb2025')
    } catch (error) {
      res.clearCookie('token');
    }
  }

  next();
}

router.use(handleToken);

const tipos = [
  "Viagem",
  "Desporto",
  "Vida Pessoal",
  "Arte & Design",
  "Tecnologia",
  "Humor"
]

const classificadores = [
  "Desporto",
  "Corrida",
  "Outdoor",
  "Caminhada",
  "Gaming",
  "Programação",
  "Cinema & Séries",
  "Pets",
  "Sketches / Desenhos",
  "Arquitetura",
  "Memes",
  "Humor Académico",
  "Inteligência Artificial",
  "Notícias Tech"
]

/* GET home page. */
router.get('/', async function(req, res, next) {
  const token = req.cookies.token;
  let user = null;
  let items = [];
  let iniciado = false;

  try {
    if (token) {
      user = jwt.verify(token, 'EngWeb2025');
      items = await index.getUserItems(token, req.query);
      iniciado = true;
    } else {
      items = await index.getPublicItems(req.query);
    }

    const noticiasResponse = await axios.get('http://api:3333/api/noticias/visible');
    const noticias = noticiasResponse.data;


    res.render('index', {
      title: 'Página Inicial',
      items,
      noticias: noticias,
      tipos,
      classificadores,
      formatTimeAgo: formatTimeAgo,
      iniciado,
      query: req.query,
      username: user ? user.username : null,
      user: user ? user : null
    });

  } catch (err) {
    console.error('Erro na homepage:', err);
    res.render('error', { error: err, message: "Algo correu mal" });
  }
 
});

router.get('/item/:id/export', async function(req, res, next) {
  try {
    token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }

    let user = null;
    try {
      user = jwt.verify(token, 'EngWeb2025');
    } catch (err) {
      return res.redirect('/login');
    }

    const response = await axios.get(`http://api:3333/api/items/${req.params.id}/export`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'stream'
    });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="dip-${req.params.id}.zip"`
    });

    response.data.pipe(res);
  } catch (error) {
    console.error('Erro no export:', error);
    res.status(500).render('error', { 
      error: error,
      message: 'Erro ao exportar o item' 
    });
  }
});

router.post('/item/:id/like', async function(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }

    const response = await axios.post(`http://api:3333/api/items/${req.params.id}/toggleLike`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    res.redirect(`/item/${req.params.id}`);
    
  } catch (error) {
    console.error('Erro no like:', error);
    if (error.response && error.response.status === 401) {
      return res.redirect('/login');
    }
    res.redirect(`/item/${req.params.id}?error=like_failed`);
  }
});

router.get('/item/:id', async function(req,res,next){
    const item = await index.getItemById(req.params.id,req.cookies.token)
    const comments = await index.getCommentsByItem(req.params.id)
    let user = null
    if (req.cookies.token) {
        user = jwt.verify(req.cookies.token, 'EngWeb2025');
    } 

    try{
      if (item.success){
              res.render('item',{
                title: item.data.titulo,
                item : item.data,
                username : user ? user.username : null,
                formatTimeAgo: formatTimeAgo,
                comments: comments.success ? comments.data : []
              })
          }
    }
    catch(err) {
        res.render('error', { error: err, message: "Não tens permissão" });
    }

    

});

/* GET login page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Iniciar sessão' })
});

router.get('/profile/:id', async function(req, res, next) {
  const token = req.cookies.token;
  let user = null;
  const user_id = req.params.id
  let items = [];
  let iniciado = false;

  try {
      if (token) {
        user = jwt.verify(token, 'EngWeb2025');
        iniciado = true;

      }

      items = await index.getItemsFromCertainUser(token, req.params.id, req.query);
      const user_info = await index.getUserInfo(req.params.id)
    
      const is_own_profile = user && user.username === req.params.id;

      res.render('profile', {
        title: req.params.id,
        items,
        formatTimeAgo: formatTimeAgo,
        formatTime: formatTime,
        iniciado,
        tipos,
        classificadores,
        user_info,
        query: req.query,
        username: user ? user.username : null,
        is_own_profile
    });

  } catch (err) {
    console.error('Erro na requisição de profile:', err);
    res.render('error', { error: err, message: "Algo correu mal" });
  }


});

router.post('/visibility/:item_id', async function(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }
    
    const user = jwt.verify(token, 'EngWeb2025');
    const item_id = req.params.item_id;
    const visible = req.body.visible === "true";
    
    await index.changeItemVisibility(token, item_id, visible);
    
    res.redirect(`/item/${req.params.item_id}`);
    
  } catch (err) {
    console.error('Erro ao alterar visibilidade:', err);
    res.render('error', { error: err, message: "Erro ao alterar visibilidade" });
  }
});

router.post('/upload-sip', upload.single('sip'), async function(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }

  try {
    let user = jwt.verify(req.cookies.token, 'EngWeb2025');
    
    const form = formData();
    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);
  
    const response = await axios.post('http://api:3333/api/items/upload', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    const data = response.data;
    fs.unlinkSync(req.file.path);

    res.redirect(`/item/${data.item._id}?upload=success`);
  
  } catch(err) {
    console.error('Erro ao enviar SIP:', err.message);
    
    // Limpar ficheiro se existir
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Redirecionar para página inicial com erro
    res.redirect('/?error=upload_failed');
  }
});

router.get('/upload', async function(req, res, next) {
  try {
    const token = req.cookies.token;
    let user = null;
    if (!token) {
      return res.redirect('/login');
    }

    user = jwt.verify(token, 'EngWeb2025');
    
    res.render('upload', {
      title: 'Criar Novo Item',
      iniciado: true,
      username: user ? user.username : null,
      tipos: tipos,
      classificadores: classificadores
    });
  } catch (err) {
    console.error('Erro ao carregar página de upload:', err);
    next(err);
  }
});

router.post('/upload', upload.array('ficheiros'), async function(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');  
  }
  
  try {
    let user = jwt.verify(req.cookies.token, 'EngWeb2025');

    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const tipo = req.body.tipo;
    const classificadores = req.body.classificadores;
    const visible = req.body.visible === 'on';
    const files = req.files;

    const sipId = uuidv4();
    const tempDir = path.join(__dirname, '../uploads', sipId);
    const dataDir = path.join(tempDir, 'data');

    fs.mkdirSync(tempDir, { recursive: true });
    fs.mkdirSync(dataDir, { recursive: true });

    const ficheiros = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let filePath = path.basename(file.originalname);
      fs.copyFileSync(file.path, path.join(tempDir, filePath));
      ficheiros.push(filePath);
      fs.unlinkSync(file.path);
    }

    let classificadoresProcessados = [];
    if (Array.isArray(classificadores)) {
      classificadoresProcessados = classificadores.map(c => c.toLowerCase());
    } else if (classificadores) {
      classificadoresProcessados = [classificadores.toLowerCase()];
    }

    const manifesto = {
      titulo,
      tipo: tipo.toLowerCase(),
      descricao,
      dataCriacao: new Date().toISOString(),
      dataSubmissao: new Date().toISOString(),
      classificadores: classificadoresProcessados,
      visible,
      ficheiros
    };

    fs.writeFileSync(
      path.join(tempDir, 'manifesto-SIP.json'),
      JSON.stringify(manifesto, null, 2),
      'utf8'
    );

    const zip = new jszip();

    function addDirectoryToZip(directoryPath, zipRoot) {
      const files = fs.readdirSync(directoryPath);
      for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          addDirectoryToZip(filePath, zipRoot.folder(file));
        } else {
          const fileData = fs.readFileSync(filePath);
          const relativePath = path.relative(tempDir, filePath);
          zipRoot.file(relativePath, fileData);
        }
      }
    }

    addDirectoryToZip(tempDir, zip);

    const zipFile = path.join(__dirname, '../uploads', `${sipId}.zip`);
    const zipContent = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });
    fs.writeFileSync(zipFile, zipContent);

    const form = new formData();
    const fileName = `${titulo.replace(/\s+/g, '_')}.zip`;
    form.append('file', fs.createReadStream(zipFile), fileName);

    const response = await axios.post('http://api:3333/api/items/upload', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    // Limpar ficheiros temporários
    fs.unlinkSync(zipFile);
    fs.rmSync(tempDir, { recursive: true, force: true });

    const data = response.data;
    res.redirect(`/item/${data.item._id}?upload=success`);

  } catch(err) {
    console.error('Erro no processamento do upload:', err);
    
    // Limpar ficheiros temporários
    if (req.files && req.files.length) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    
    // Redirecionar para página inicial com erro
    res.redirect('/?error=upload_failed');
  }
});

router.post('/comment', async function (req,res,next) {
  try {
    const token = req.cookies.token
    if(!token){
      return res.redirect('/login');
    }
    const user = jwt.verify(token,"EngWeb2025");
    const item_id = req.body.item_id
    const descricao = req.body.descricao

    if (!item_id || !descricao) {
        throw new Error("Item ID e descrição são obrigatórios");
    }

    await index.uploadComment(token,item_id,descricao);

    res.redirect(`/item/${item_id}`);
  }catch(err){
    console.error("Erro ao enviar o comentário:", err)
    res.render('error', { error: err, message: "Erro ao enviar comentário" });
  }
})

router.get('/search', async function(req, res, next) {
  const query = req.query.q;

  const token = req.cookies.token;
  let user = null;
  if (token) {
      user = jwt.verify(token, 'EngWeb2025');
  }

  const response = await axios.get(`http://api:3333/api/users/search?q=${query}`);
  const data = response.data;

  console.log(data);

  res.render('searchuser', {
    title: 'Procurar utilizador',
    username: user ? user.username : null,
    users: data,
    formatTime: formatTime
  });
});

router.get('/auth/facebook', function (req, res, next) {
  res.redirect('http://localhost:3333/api/users/auth/facebook/callback');
});

router.get('/auth/google', function (req, res, next) {
  res.redirect('http://localhost:3333/api/users/auth/google');
});

router.get('/auth/social/callback', (req, res) => {
  const token = req.query.token;
  if (token) {
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

/* POST login in the system */
router.post('/login', async function(req, res, next) {
  const { username, password } = req.body;
  const result = await index.login(username, password);

  if (result && result.token) {
    res.cookie('token', result.token, { httpOnly: true });
    res.redirect('/');
  } else {
    res.render('login', { title: 'Iniciar sessão', erro: 'Credenciais inválidas' });
  }
});

/* POST logout from the system */
router.post('/logout', function(req, res, next) {
  res.clearCookie('token')
  res.redirect('/')
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Criar conta' })
});

router.post('/register', async function(req,res,next){
  try {
    const { username,r_name, email, password, confirmPassword } = req.body;

    if(password != confirmPassword){
       return res.render('register', { title: 'Criar conta', error: 'As senhas não coincidem' });
    }
  
    const result = await index.registerUser({
      username: username,
      email: email,
      name: r_name,
      level: "user",
      password: password
    });

    if (result){
        return res.redirect('/login');
    }else{
        return res.render('register', { 
          title: 'Iniciar sessão',
          error: result.message || 'Erro ao registrar usuário'
      });
    }

  }catch(err){
    console.error('Erro ao processar registro:', err);
    res.render('register', { title: 'Iniciar sessão', error: 'Ocorreu um erro no registro' });
  }

});

router.post('/edit-profile', async function(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }
    
    const user = jwt.verify(token, 'EngWeb2025');
    const { name, password, newPassword, confirmPassword } = req.body;
    const userInfo = await index.getUserInfo(user.username);
    const hasFacebookLogin = userInfo && userInfo.facebookId;
    
    const updateData = {
      name
    };

    if (!hasFacebookLogin && newPassword) {
      if (newPassword !== confirmPassword) {
        return res.render('edit_profile', { 
          title: 'Editar perfil',
          error: 'As senhas não coincidem', 
          user_info: userInfo,
          success: null
        });
      }
      
      if (!password) {
        return res.render('edit_profile', { 
          title: 'Editar perfil',
          error: 'A senha atual é obrigatória para alterar a senha', 
          user_info: userInfo,
          success: null
        });
      }

      let result
      try {
        result = await axios.post("http://api:3333/api/users/change-password", {
          oldPassword: password,
          newPassword: newPassword
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        return res.render('edit_profile', { 
          title: 'Editar perfil',
          error: 'Senha atual incorreta', 
          user_info: userInfo,
          success: null
        });
      }
    
      updateData.password = newPassword;
    }
    

    try {
        result = await axios.post("http://api:3333/api/users/change-name", {
          username: user.username,
          name: name
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        return res.render('edit_profile', { 
          title: 'Editar perfil',
          error: 'Não foi possível trocar o seu nome', 
          user_info: userInfo,
          success: null
        });
      }
        
    if (result) {
      const updatedUserInfo = await index.getUserInfo(user.username);
      
      return res.render('edit_profile', {
        title: 'Editar perfil',
        user_info: updatedUserInfo,
        success: 'Perfil atualizado com sucesso!',
        error: null
      });
    } 
  } catch (err) {
    console.error('Erro ao processar edição de perfil:', err);
    res.render('error', { error: err, message: "Erro ao atualizar perfil" });
  }
});

router.get('/edit-profile', async function(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }
    
    const user = jwt.verify(token, 'EngWeb2025');
    const userInfo = await index.getUserInfo(user.username);
    
    res.render('edit_profile', { title: 'Editar perfil', user_info: userInfo, error: null, success: null });
  } catch (err) {
    console.error('Erro ao carregar página de edição de perfil:', err);
    res.render('error', { error: err, message: "Erro ao carregar perfil" });
  }
});

router.post('/upload-avatar', upload.single('avatar'), async function(req, res, next) {
  try {
    const token = req.cookies.token;
    const user = jwt.verify(token, 'EngWeb2025');
    
    const FormData = require('form-data');
    const fs = require('fs');
    
    const form = new FormData();
    form.append('avatar', fs.createReadStream(req.file.path), req.file.originalname);
    
    await axios.post('http://api:3333/api/users/upload-avatar', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    
    fs.unlinkSync(req.file.path);
    
    res.redirect('/profile/' + user.username);
  } catch (err) {
    res.redirect('/profile/' + user.username + '?error=upload-failed');
  }
});

// Rota para eliminar item (sem auth.validate)
router.post('/delete-item/:id', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.redirect('/login');
        }
        
        const response = await axios.delete(`http://api:3333/api/items/${req.params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const user = jwt.verify(token, 'EngWeb2025');
        res.redirect(`/profile/${user.username}?deleted=success`);
        
    } catch (error) {
        console.error('Erro ao eliminar item:', error.response?.data || error.message);
        
        const token = req.cookies.token;
        if (token) {
            const user = jwt.verify(token, 'EngWeb2025');
            res.redirect(`/profile/${user.username}?error=delete_failed`);
        } else {
            res.redirect('/login');
        }
    }
});

// Rota para eliminar comentário
router.post('/delete-comment/:id', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.redirect('/login');
        }
        
        const response = await axios.delete(`http://api:3333/api/comments/${req.params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const itemId = req.body.item_id;
        res.redirect(`/item/${itemId}?comment_deleted=success`);
        
    } catch (error) {
        console.error('Erro ao eliminar comentário:', error.response?.data || error.message);
        
        const itemId = req.body.item_id;
        res.redirect(`/item/${itemId}?error=comment_delete_failed`);
    }
});



module.exports = router;
