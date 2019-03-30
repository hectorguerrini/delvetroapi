const querySql = require('./mssqlConfig')();

exports.cadastro = function (req, res) {
    if (req.method === 'POST'){
        if (req.params.tipo == 'cliente') {
            var query = `
                        EXEC sp_update_cadastro_clientes
                        @ID_CLIENTE = ${req.body.ID_CLIENTE ? req.body.ID_CLIENTE : -1},
                        @NOVO_CADASTRO = ${req.body.ID_CLIENTE ? 0 : 1},
                        @NM_CLIENTE = '${req.body.NM_CLIENTE}',
                        @ENDERECO = '${req.body.ENDERECO}',
                        @NUMERO = ${req.body.NUMERO},
                        @BAIRRO = '${req.body.BAIRRO}',
                        @CIDADE = '${req.body.CIDADE}',
                        @CEP = '${req.body.CEP}',
                        @ESTADO = '${req.body.ESTADO}',
                        @TELEFONE_1 = '${req.body.TELEFONE_1}',
                        ${req.body.TELEFONE_2 ? '@TELEFONE_2 = \'' + req.body.TELEFONE_2 + '\',' : ''}
                        ${req.body.TELEFONE_3 ? '@TELEFONE_3 = \'' + req.body.TELEFONE_3 + '\',' : ''}
                        @RG = '${req.body.RG}',
                        @EMAIL = '${req.body.EMAIL}',
                        @RAZAO_SOCIAL = '${req.body.RAZAO_SOCIAL}',
                        @NM_CONTATO = '${req.body.NM_CONTATO}',
                        @CPF = '${req.body.CPF}',
                        @LOJISTA = ${req.body.LOJISTA}
                        ${req.body.COMPLEMENTO ? ',@COMPLEMENTO = \'' + req.body.COMPLEMENTO + '\'' : ''}
                        `;
        }
    }
    else if(req.method === 'GET'){
        if (req.params.tipo == 'cliente') {
            var query = `
            EXEC sp_get_cadastro_cliente
            @ID_CLIENTE = ${req.params.ID_CLIENTE}
            `;
        }
    }
    

    querySql.queryDB(query, (err, result) => {
        if (err) {
            console.dir(err);
            return;
        }
        res.json({
            query: query,
            json: result
        });
    });
}

exports.combo = function (req, res) {
    if (req.params.tipo == 'clientes') {
        var query = 'SELECT ID_CLIENTE AS VALOR, NM_CLIENTE AS LABEL FROM DV_CADASTRO_CLIENTES';
    }

    querySql.queryDB(query, (err, result) => {
        if (err) {
            console.dir(err);
            return;
        }
        res.json({
            query: query,
            json: result
        });
    });
}