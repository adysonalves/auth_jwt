const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET

// Gera o Token
function gerarToken(user){
    return jwt.sign({id: user.id, usuario: user.usuario}, secret, {
        expiresIn: 120
    });
}

// Middleware que verifica o token, usado nas rotas.
function verificaToken(req, res, next){
    const token = req.headers['authorization'];

    if(!token){
        res.status(401).json({"auth":false, "message":"Token não informado."});
        return;
    }

    jwt.verify(token, secret, (err,decoded) => {
        if(err){
            res.status(500).json({"auth":false, "message":"Token iválido. Faça login!"});
            return;
        }
        
        req.userId = decoded.id;
        req.userName = decoded.usuario
        next();
    })
}

module.exports = {gerarToken, verificaToken};