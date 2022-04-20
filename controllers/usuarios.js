const Usuario = require('../models/usuarios');
const Auth = require('../models/auth');
module.exports = app => {
    app.post('/usuarios', (req, res) => {
        const usuario = req.body; 
        console.log(usuario);
        Usuario.adiciona(usuario, res);
    });

    
}