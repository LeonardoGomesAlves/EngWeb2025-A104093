var express = require('express');
var router = express.Router();
var Noticia = require('../controllers/noticias')

router.get('/visible', async function(req, res) {
    try {
      const noticias = await Noticia.getVisible()
      res.json(noticias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;