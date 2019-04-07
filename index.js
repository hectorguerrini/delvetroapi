var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');

var controller = require('./controller');
moment.locale('pt-br');
app.use(bodyParser.json());

app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    next();
});

app.get('/delvetroapi/', (req, res) => res.send('Hello Delvetro!'))

app.route('/delvetroapi/cadastro/:tipo').post(controller.cadastro);

app.route('/delvetroapi/cadastro/:tipo/:ID').get(controller.cadastro);

app.route('/delvetroapi/combo/:tipo').get(controller.combo);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Del Vetro app listening on port ${port}!`))