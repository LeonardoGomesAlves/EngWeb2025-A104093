var express = require('express')
var passport = require('passport')
var User = require('../models/user')
var router = express.Router()
var jwt = require('jsonwebtoken')
var UserController = require('../controllers/users')
var multer = require('multer')
const path = require('path')
const fs = require('fs')

const avatarDir = path.join(__dirname, '../uploads/avatars/');
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype.startsWith('image/'))
  }
});

router.post('/upload-avatar', upload.single('avatar'), async function(req, res, next) {
  try {
    let token = req.get("Authorization");
    if (!token) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    token = token.split(' ')[1];
    const user = jwt.verify(token, 'EngWeb2025');
    
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum ficheiro enviado' });
    }

    const avatarUrl = `/api/files/avatars/${req.file.filename}`;
    
    const updatedUser = await User.findOneAndUpdate(
      { username: user.username },
      { avatar: avatarUrl },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }
    
    res.json({ 
      message: 'Avatar atualizado com sucesso!',
      avatarUrl: avatarUrl 
    });
    
  } catch (err) {
    console.error('Erro no upload do avatar:', err);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});


// register
router.post('/register', function (req, res, next) {
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
            console.log({user})
            if(err) res.jsonp(err)
            else res.send("Success")
        }
    )
});

// login
router.post('/login', passport.authenticate('local'), (req, res) => {
    jwt.sign(
      {
        username : req.user.username,
        level: req.user.level,
        sub: 'EngWeb2025'
      },
      "EngWeb2025",
      {expiresIn: '1d'},
      (err, token) => {
        if(err) res.jsonp(err)
        else res.status(201).jsonp({token: token})
      }
    )
  })

router.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  let token = req.get("Authorization")
  if (!token) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  token = token.split(' ')[1]  

  try {
    let temp = jwt.verify(token,"EngWeb2025")
    const user = await UserController.getUserByUsername(temp.username);
    

    user.changePassword(oldPassword, newPassword, (err) => {
      if (err) {
        return res.status(400).json({ message: 'Password antiga incorreta ou erro ao trocar.' });
      }

      res.json({ message: 'Password trocada com sucesso!' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno ao trocar password.' });
  }
});


router.post('/change-name', async (req, res) => {
  const { name } = req.body;
  let token = req.get("Authorization");
  if (!token) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  token = token.split(' ')[1];

  try {
    let temp = jwt.verify(token, "EngWeb2025");
    const result = await UserController.changeName(temp.username, name);
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro interno ao alterar nome.' });
  }
});

router.get('/search', function (req, res, next) {
    let query = req.query.q;

    UserController.getUserFromSearch(query)
        .then(data => res.status(200).jsonp(data))
        .catch(err => res.status(500).jsonp(err))

});

router.get('/:id', function (req, res, next) {
  UserController.getUserInfo(req.params.id)
      .then(data => res.status(200).jsonp(data))
      .catch(err => res.status(500).jsonp(err))
})

router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/login' }),
  function(req, res) {
    const token = jwt.sign(
      {
        username: req.user.username,
        level: req.user.level,
        sub: 'EngWeb2025'
      },
      "EngWeb2025",
      { expiresIn: '1d' }
    );
    res.redirect(`http://localhost:3000/auth/social/callback?token=${token}`);
  }
);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  function(req, res) {
    const token = jwt.sign(
      {
        username: req.user.username,
        level: req.user.level,
        sub: 'EngWeb2025'
      },
      "EngWeb2025",
      { expiresIn: '1d' }
    );
    res.redirect(`http://localhost:3000/auth/social/callback?token=${token}`);
  }
);



module.exports = router;