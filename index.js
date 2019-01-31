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
    firebirdConfig.Execute(`
        SELECT 
            a.ven_codigo, ven_data, ven_hora, con_codigo, ven_responsavel, ven_total,
            ven_status, vei_codigo, c.pro_codigo, pro_nome, pro_categoria, pro_setor, vei_med1 altura,
            vei_med2 largura, VEI_QTDE metro, VEI_SUBQTDE qtde
        FROM vendas AS a
        INNER JOIN vendasitens b ON a.ven_codigo = b.ven_codigo
        INNER JOIN produtos c ON c.pro_codigo = b.pro_codigo        
        WHERE 
            ven_data >= '${req.body.dataMin}' AND ven_data <= '${req.body.dataMax}'
            ${req.body.cliente ? `AND VEN_RESPONSAVEL LIKE '%${req.body.cliente.toUpperCase()}%'`: '' } 
        ORDER BY VEN_DATA DESC, VEN_HORA DESC `,
        (result) => {
            let jsonRetorno = []
            result.forEach((el) => {
                let index = jsonRetorno.findIndex((js) => {
                    return js.ven_codigo == el.VEN_CODIGO
                });
                if (index != -1) {
                    let json = {
                        vei_codigo: el.VEI_CODIGO,
                        pro_codigo: el.PRO_CODIGO,
                        pro_nome: el.PRO_NOME,
                        pro_categoria: el.PRO_CATEGORIA,
                        pro_setor: el.PRO_SETOR,
                        altura: el.ALTURA,
                        largura: el.LARGURA,
                        metro: el.ALTURA*el.LARGURA ? el.METRO : 0,
                        qtde: el.QTDE
                    }
                    jsonRetorno[index].produtos.push(json);
                } else {
                    let json = {
                        ven_codigo: el.VEN_CODIGO,
                        ven_data: el.VEN_DATA,
                        ven_hora: el.VEN_HORA,                        
                        con_codigo: el.CON_CODIGO,
                        ven_responsavel: el.VEN_RESPONSAVEL,
                        ven_status: el.VEN_STATUS,
                        ven_total: el.VEN_TOTAL,
                        status_pagamento: 'Ñ Pago',
                        qtde_pago: 0,
                        produtos: [{
                            vei_codigo: el.VEI_CODIGO,
                            pro_codigo: el.PRO_CODIGO,
                            pro_nome: el.PRO_NOME,
                            pro_categoria: el.PRO_CATEGORIA,
                            pro_setor: el.PRO_SETOR,
                            altura: el.ALTURA,
                            largura: el.LARGURA,
                            metro: el.ALTURA*el.LARGURA ? el.METRO : 0,
                            qtde: el.QTDE
                        }],
                        caixa: []
                    }
                    jsonRetorno.push(json);
                }


            })

            res.json(jsonRetorno);
        });

});
app.post('/listaCaixa', (req, res) => {
    firebirdConfig.Execute(`
        SELECT 
            a.ven_codigo, REPLACE(d.cai_id,'VEN ', '') cai_id, ven_data, ven_hora, cai_pagamento, d.cai_codigo, cai_credito, cai_debito, 
            cai_forma,cai_categoria 
        FROM vendas AS a
        INNER JOIN caixa d on d.cai_categoria IN ('VENDA','SERVICOS') and replace(d.cai_id,'VEN ', '')= a.ven_codigo
        WHERE 
            ven_data >= '${req.body.dataMin}' AND ven_data <= '${req.body.dataMax}'
            ${req.body.cliente ? `AND VEN_RESPONSAVEL LIKE '%${req.body.cliente.toUpperCase()}%'`: '' } 
        ORDER BY VEN_DATA DESC, VEN_HORA DESC`, 
        (result) => {
        res.json(result);
    });

});
app.post('/cabecalho', (req, res) => {
    firebirdConfig.Execute(`
        SELECT 1 AS id, 'Pedidos' AS label,sum(ven_total) AS valor FROM vendas
        WHERE ven_data >= '01-01-2019' AND ven_data <= '01-31-2019'
        UNION ALL
        SELECT 2 AS id, 'Faturamento' AS label,sum(cai_credito+cai_debito) AS valor FROM caixa
        WHERE 
            cai_pagamento >= '${req.body.dataMin}' AND cai_pagamento <= '${req.body.dataMax}' 
            AND cai_categoria IN ('VENDA','SERVICOS')            
    `,
    (result) => {
        res.json(result)
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))