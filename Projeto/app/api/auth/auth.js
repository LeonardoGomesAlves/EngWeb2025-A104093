var jwt = require('jsonwebtoken')

module.exports.validate = (req, res, next) => {
    var token = req.get('Authorization')
    
    if(token){
        token = token.split(' ')[1]

        jwt.verify(token, "EngWeb2025", (err, payload) => {
            if(err) res.status(401).jsonp(err)
            else{
                next()
            }
        })
    }else{
        res.status(401).jsonp({error: "Token inexistente"})
    }
}

module.exports.validateDoc = (req, res, next) => {
    var token = req.get('Authorization')

    
    if(token){
        token = token.split(' ')[1]
        jwt.verify(token, "EngWeb2025", (err, payload) => {
            if(err) res.status(401).jsonp(err)
            else{
                console.log(payload);
                if(payload.level == "admin"){
                    next()
                }else{
                    res.status(401).jsonp({error: "User sem permissão para aceder ao conteúdo"})
                }
            }
        })
    }else{
        res.status(401).jsonp({error: "Token inexistente"})
    }
}