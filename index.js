var express = require('express');
var app = express();
const port = 3000

var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    next();
});

var firebirdConfig = require('./firebirdConfig')();
console.log(firebirdConfig)


app.get('/', (req, res) => res.send('Hello Delvetro!'))
app.post('/listaVendas', (req, res) => {
    firebirdConfig.Execute(`SELECT * FROM vendas WHERE ven_data = '${req.body.data}' ORDER BY VEN_HORA DESC `, (result) => {
        res.json(result);
    });

});
app.post('/listaCaixa', (req, res) => {
    firebirdConfig.Execute(`SELECT * FROM caixa WHERE cai_categoria = 'VENDA' 
        AND cai_pagamento = '${req.body.data}' ORDER BY cai_codigo DESC `, (result) => {
        res.json(result);
    });

});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))