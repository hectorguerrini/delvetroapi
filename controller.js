const querySql = require('./mssqlConfig')();

function getQuery(tipo, method, args, params) {
    let query = '';
    if (method === 'POST') {
        switch (tipo) {
            case 'venda':
                query = `
                EXEC sp_update_cadastro_venda
                @jsonVariable = '${JSON.stringify(args)}'
                `;
                break;
            case 'cliente':
                // @NOVO_CADASTRO = ${args.ID_CLIENTE ? 0 : 1}
                query = `
                EXEC sp_update_cadastro_clientes
                @ID_CLIENTE = ${args.ID_CLIENTE ? args.ID_CLIENTE : -1},
                @NM_CLIENTE = '${args.NM_CLIENTE ? args.NM_CLIENTE : ''}',
                @ENDERECO = '${args.ENDERECO}',
                @NUMERO = ${args.NUMERO},
                @BAIRRO = '${args.BAIRRO}',
                @CIDADE = '${args.CIDADE}',
                @CEP = '${args.CEP}',
                @ESTADO = '${args.ESTADO}',
                @TELEFONES = '${args.TELEFONES ? JSON.stringify(args.TELEFONES) : [] }',
                @RG = '${args.RG}',
                @EMAIL = '${args.EMAIL}',
                @RAZAO_SOCIAL = '${args.RAZAO_SOCIAL}',
                @NM_CONTATO = '${args.NM_CONTATO}',
                @CPF = '${args.CPF}',
                @LOJISTA = ${args.LOJISTA}
                ${args.COMPLEMENTO ? ',@COMPLEMENTO = \'' + args.COMPLEMENTO + '\'' : ''}
                `;
                break;
            case 'estoque':
                query = `
                EXEC sp_update_cadastro_estoque
                @ID_ESTOQUE = '${args.ID_ESTOQUE}',
                @ID_TIPO = '${args.ID_TIPO}',
                @DESCRICAO = '${args.DESCRICAO}',
                @QTDE = ${args.QTDE},
                @UNIDADE = '${args.UNIDADE}',
                @LOCALIZACAO = '${args.LOCALIZACAO}',
                @ESTOQUE_MIN = ${args.ESTOQUE_MIN},
                @ESTOQUE_MAX = ${args.ESTOQUE_MAX},
                @CUSTO_ULTIMO_RECEBIMENTO = ${args.CUSTO_ULTIMO_RECEBIMENTO},
                @ESPESSURA = ${args.ESPESSURA}
                `;
                break;
            case 'servico':
                query = `
                EXEC sp_update_cadastro_servico
                @ID_SERVICO = ${args.ID_SERVICO},
                @ID_TIPO = ${args.ID_TIPO},
                @UNIDADE_CUSTO = '${args.UNIDADE_CUSTO}',
                @CUSTO_POR_UNIDADE = ${args.CUSTO_POR_UNIDADE},
                @PRZ_CONCLUSAO = ${args.PRZ_CONCLUSAO},
                @OBS = '${args.OBS}',
                @ID_BENEFICIADO = ${args.ID_BENEFICIADO},
                @DESCRICAO = '${args.DESCRICAO}',
                @EXTERNO = ${args.EXTERNO}
                `;
                break;
            case 'beneficiado':
                query = `
                EXEC sp_update_cadastro_estoque
                @ID_BENEFICIADO = '${args.ID_BENEFICIADO}',
                @NM_BENEFICIADO = '${args.NM_BENEFICIADO}',
                @TIPO_BENEFICIARIO = ${args.TIPO_BENEFICIARIO},
                @CPF = '${args.CPF}',
                @CNPJ = '${args.CNPJ}',
                @RAZAO_SOCIAL = ${args.RAZAO_SOCIAL},
                `;
                break;
            case 'produto':
                query = `
                EXEC sp_update_cadastro_produto
                @ID_PRODUTO = ${args.ID_PRODUTO ? args.ID_PRODUTO : null},
                @NM_PRODUTO = '${args.NM_PRODUTO}',
                @TIPO = '${args.TIPO}',
                @UNIDADE_VENDA = '${args.UNIDADE_VENDA}',
                @PRECO_UNITARIO = ${args.PRECO_UNITARIO},
                @PRZ_ENTREGA = ${args.PRZ_ENTREGA},
                @CUSTO = ${args.CUSTO},
                @COMPOSICAO = '${args.COMPOSICAO ? JSON.stringify(args.COMPOSICAO) : []}'
                `;
                break;
            case 'composicao_produto_estoque':
                query = `
                EXEC sp_update_cadastro_composicao_produto_estoque
                @ID_PRODUTO = ${args.ID_PRODUTO},
                @ID_ESTOQUE = ${args.ID_ESTOQUE},
                @QTDE_UTILIZADA = ${args.QTDE_UTILIZADA},
                @CUSTO = ${args.CUSTO},
                @ID_COMPOSICAO_ESTOQUE = ${args.ID_COMPOSICAO_ESTOQUE ? args.ID_COMPOSICAO_ESTOQUE : null}
                `;
                break;
            case 'composicao_produto_servico':
                query = `
                EXEC sp_update_cadastro_composicao_produto_servico
                @ID_PRODUTO = ${args.ID_PRODUTO},
                @ID_SERVICO = ${args.ID_SERVICO},
                @ID_COMPOSICAO_SERVICO = ${args.ID_COMPOSICAO_SERVICO ? args.ID_COMPOSICAO_SERVICO : null}
                `;
                break;
        }
    } else if (method === 'GET') {
        switch (tipo) {
            case 'cliente':
                query = `
                EXEC sp_get_cadastro_cliente
                @ID_CLIENTE = ${params.ID}
                `;
                break;
            case 'beneficiado':
                query = `
                EXEC sp_get_cadastro_beneficiado
                @ID_BENEFICIADO = ${params.ID}
                `;
                break;
            case 'servico':
                query = `
                EXEC sp_get_servico
                @ID_SERVICO = ${params.ID}
                `;
                break;
            case 'estoque':
                query = `
                EXEC sp_get_estoque
                @ID_ESTOQUE = ${params.ID}
                `;
                break;
            case 'vendas':
                query = `
                EXEC sp_get_vendas
                @ID_CLIENTE = ${params.ID}
                `;
                break;
            case 'produtos':
                query = `
                EXEC sp_get_produtos
                @ID_PRODUTOS = ${params.ID}
                `;
                break;
        }
    }
    return query;
}

exports.cadastro = function (req, res) {
    var query = getQuery(req.params.tipo, req.method, req.body, req.params);

    querySql.queryDB(query, (err, result) => {
        if (err) {
            console.dir(err);
            return;
        }
        result = req.params.tipo !== 'produtos' ? result : result[0].produtos
        res.json({
            query: query,
            json: result
        });
    });
}

exports.combo = function (req, res) {
    var query = `EXEC sp_get_combo @COMBO='${req.params.tipo}'`;

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