require('dotenv').config();
const express = require('express');
const conn = require('./database/conn');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Middleware
const auth = require('./functions/auth');

// MODELS
const User = require('./models/User');

// Rotas
app.get('/', (req,res) => {
    res.json({'message':'Bem-vindo(a), você está na home da API.'});
});

app.post('/cadastrar', async (req,res) => {
    let {usuario, passwd} = req.body;

    usuario = usuario.trim();
    passwd = await bcrypt.hash(passwd, 10);

    await User.create({
        usuario: usuario,
        passwd: passwd
    }).then(data => {
        const token = auth.gerarToken(data)
        res.json([{"usuario":data}, {"token":token}]);
    }).catch(err => {
        if(err.name === "SequelizeUniqueConstraintError"){
            res.json({'error':'Já existe um usuário cadastrado com esse username.'});
            return;
        }

        res.json({"error":`${err}`});
    });

});

app.post('/signin', async(req,res) => {
    const user = {
        usuario: req.body.usuario,
        passwd: req.body.passwd
    }

    const buscaUser = await User.findOne({where: {usuario: user.usuario}, raw: true});

    if(buscaUser && await bcrypt.compare(user.passwd, buscaUser.passwd)){
        const token = auth.gerarToken(buscaUser);
        res.json(token)
        return;
    }

    res.json('usuário ou senha inválidos!')

});

app.get('/painel', auth.verificaToken, (req,res) => {
    res.json(req.userName);
})


conn.sync()
.then(() => {
    app.listen(PORT);
}).catch(err => console.log(err));

