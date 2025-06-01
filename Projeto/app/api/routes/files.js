var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

router.get('/public/:id/:path', function(req, res, next) {
  const { id, path: fileName } = req.params;
  const filePath = path.join(__dirname, '..', 'repository', id, fileName);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send('Ficheiro não encontrado');
    }
    res.sendFile(filePath)
  })
});

router.get('/avatars/:filename', function(req, res, next) {
  const { filename } = req.params;
  
  const avatarPath = path.join(__dirname, '..', 'uploads', 'avatars', filename);
  
  fs.stat(avatarPath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send('Avatar não encontrado');
    }

    const ext = path.extname(filename).toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (!validExtensions.includes(ext)) {
      return res.status(400).send('Tipo de ficheiro não permitido');
    }

    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    res.setHeader('Content-Type', contentTypes[ext] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    console.log('Enviando avatar:', avatarPath);
    
    res.sendFile(avatarPath);
  });
});

module.exports = router;