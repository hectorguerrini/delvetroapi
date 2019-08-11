const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var moment = require('moment');
const cors = require('cors')
var controller = require('./controller');
moment.locale('pt-br');
app.use(bodyParser.json());
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.get('/delvetroapi/', (req, res) => res.send('Hello Delvetro!'))

app.route('/delvetroapi/cadastro/:tipo').post(controller.cadastro);

app.route('/delvetroapi/nfe/emissao/:ID_VENDA').get(controller.nfe);

app.route('/delvetroapi/cadastro/:tipo/:ID').get(controller.cadastro);

app.route('/delvetroapi/get/:tipo/:ID').get(controller.cadastro);

app.route('/delvetroapi/combo/:tipo').get(controller.combo);

app.route('/delvetroapi/upload/:ID_CLIENTE').post(controller.upload);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Del Vetro app listening on port ${port}!`))