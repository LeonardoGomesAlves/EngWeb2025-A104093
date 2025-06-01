var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken');
const auth = require('../auth/auth')
var CommentController = require('../controllers/comment')


// upload comentário
router.post('/upload',auth.validate, async function(req, res,next) {
    try {
        var token = req.get('Authorization');
        token = token.split(' ')[1]
        var utilizador = jwt.verify(token, 'EngWeb2025');
        const comment = {
            user_id: utilizador.username, 
            item_id: req.body.item_id,
            descricao: req.body.descricao
        };
        
        const savedComment = await CommentController.upload_comment(comment);
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obter comentários de um item
router.get('/item/:id', async function(req, res,next) {
    try {
        const item_id = req.params.id;
        const comments = await CommentController.getCommentsByItem(item_id)
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar comentário
router.delete('/:id', auth.validate, async function(req, res, next) {
    try {
        const { id } = req.params;
        const token = req.get('Authorization').split(' ')[1];
        const user = jwt.verify(token, 'EngWeb2025');
        
        const comment = await CommentController.findById(id);
        if (!comment) {
            return res.status(404).json({ erro: "Comentário não encontrado" });
        }
        
        // Verificar se o utilizador é o dono do comentário
        if (comment.user_id !== user.username) {
            return res.status(403).json({ erro: "Não tem permissão para eliminar este comentário" });
        }
        
        // Eliminar o comentário
        await CommentController.deleteById(id);
        
        res.status(200).json({ 
            success: true, 
            message: "Comentário eliminado com sucesso" 
        });
        
    } catch (err) {
        console.error('Erro ao eliminar comentário:', err);
        res.status(500).json({ erro: "Erro interno do servidor: " + err.message });
    }
});

module.exports = router;