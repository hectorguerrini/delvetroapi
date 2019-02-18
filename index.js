var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var moment = require('moment');
moment.locale('pt-br');
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


app.get('/delvetroapi/', (req, res) => res.send('Hello Delvetro!'))
app.post('/delvetroapi/teste',(req,res) =>{
    firebirdConfig.Execute(`
        DECLARE VARIABLE nome VARCHAR(40);

        nome = ${req.body.nome};
        select nome AS name
    `,(result) => {
        res.json(result);
    })
} )
app.post('/delvetroapi/listaVendas', (req, res) => {
    firebirdConfig.Execute(`    
        SELECT DISTINCT
            a.ven_codigo, ven_data, ven_hora, a.con_codigo, ven_responsavel, ven_total, max(cai_pagamento) cai_pagamento,
            ven_status, vei_codigo, c.pro_codigo, pro_nome, pro_categoria, pro_setor, vei_med1 altura,
            vei_med2 largura, VEI_QTDE metro, VEI_SUBQTDE qtde
        FROM vendas AS a
        LEFT JOIN vendasitens b ON a.ven_codigo = b.ven_codigo
        LEFT JOIN produtos c ON c.pro_codigo = b.pro_codigo        
        LEFT JOIN caixa ON cai_id like a.ven_codigo
        WHERE 
            ven_responsavel NOT LIKE '%DEL VETRO%'
            ${req.body.pedido.filter ? ` 
                AND ven_data >= '${req.body.pedido.dataMin}' 
                AND ven_data <= '${req.body.pedido.dataMax}'
            ` : ''}                         
            ${req.body.pagamento.filter ? ` 
                AND cai_pagamento >= '${req.body.pagamento.dataMin}' 
                AND cai_pagamento <= '${req.body.pagamento.dataMax}'
            ` : ''}           
            ${req.body.cliente ? `AND VEN_RESPONSAVEL LIKE '%${req.body.cliente.toUpperCase()}%'`: '' } 
        GROUP BY 
            a.ven_codigo, ven_data, ven_hora, a.con_codigo, ven_responsavel, ven_total,
            ven_status, vei_codigo, c.pro_codigo, pro_nome, pro_categoria, pro_setor, vei_med1,
            vei_med2, VEI_QTDE, VEI_SUBQTDE
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
                        metro: el.ALTURA * el.LARGURA ? el.METRO : 0,
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
                        cai_pagamento: el.CAI_PAGAMENTO,
                        qtde_pago: 0,
                        produtos: [{
                            vei_codigo: el.VEI_CODIGO,
                            pro_codigo: el.PRO_CODIGO,
                            pro_nome: el.PRO_NOME,
                            pro_categoria: el.PRO_CATEGORIA,
                            pro_setor: el.PRO_SETOR,
                            altura: el.ALTURA,
                            largura: el.LARGURA,
                            metro: el.ALTURA * el.LARGURA ? el.METRO : 0,
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
app.post('/delvetroapi/listaCaixa', (req, res) => {
    firebirdConfig.Execute(`
        SELECT DISTINCT
            a.ven_codigo, REPLACE(d.cai_id,'VEN ', '') cai_id, ven_data, ven_hora, cai_pagamento, d.cai_codigo,
            cai_credito, cai_debito, cai_forma,cai_categoria 
        FROM vendas AS a
        INNER JOIN caixa d on d.cai_categoria IN ('VENDA','SERVICOS') and replace(d.cai_id,'VEN ', '')= a.ven_codigo
        WHERE 
            ven_responsavel NOT LIKE '%DEL VETRO%'
            ${req.body.pedido.filter ? ` 
                AND ven_data >= '${req.body.pedido.dataMin}' 
                AND ven_data <= '${req.body.pedido.dataMax}'
            ` : ''}             
            
            ${req.body.pagamento.filter ? ` 
                AND cai_pagamento >= '${req.body.pagamento.dataMin}' 
                AND cai_pagamento <= '${req.body.pagamento.dataMax}'
            ` : ''}  
            ${req.body.cliente ? `AND VEN_RESPONSAVEL LIKE '%${req.body.cliente.toUpperCase()}%'`: '' } 
        ORDER BY VEN_DATA DESC, VEN_HORA DESC`,
        (result) => {
            res.json(result);
        });

});
app.post('/delvetroapi/cabecalho', (req, res) => {
    firebirdConfig.Execute(`
        SELECT 1 AS id, 'Pedidos' AS label,sum(ven_total) AS valor FROM vendas
        WHERE ven_data >= '${req.body.dataMin}' AND ven_data <= '${req.body.dataMax}'
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
app.post('/delvetroapi/grafico/:tipo', (req, res) => {
    let endMonth = moment(req.body.data, 'MM-DD-YYYY').endOf('month').format('MM-DD-YYYY');
    let startMonth = moment(req.body.data, 'MM-DD-YYYY').startOf('month').format('MM-DD-YYYY');
    let endMonthAnterior = moment(req.body.data, 'MM-DD-YYYY').subtract(1, 'month').endOf('month').format('MM-DD-YYYY');
    let startMonthAnterior = moment(req.body.data, 'MM-DD-YYYY').subtract(1, 'month').startOf('month').format('MM-DD-YYYY');
    let mesAtual = moment(req.body.data, 'MM-DD-YYYY').format('MMMM');
    let mesAnterior = moment(req.body.data, 'MM-DD-YYYY').subtract(1, 'month').format('MMMM');
    let query = '';
    if (req.params.tipo == 'faturamento') {
        query = `
            select '${mesAtual}' as label,sum(cai_credito) AS valor from caixa
            inner join vendas on replace(cai_id,'VEN ', '') = vendas.ven_codigo
            where
            cai_pagamento >= '${startMonth}' AND cai_pagamento <= '${endMonth}'
            AND ven_data >= '${startMonth}' AND ven_data <= '${endMonth}'
            AND cai_categoria IN ('VENDA','SERVICOS')            
            UNION ALL 
            select '${mesAnterior}' as label,sum(cai_credito) AS valor from caixa 
            inner join vendas on replace(cai_id,'VEN ', '') = vendas.ven_codigo
            where
            cai_pagamento >= '${startMonth}' AND cai_pagamento <= '${endMonth}'
            AND ven_data >= '${startMonthAnterior}' AND ven_data <= '${endMonthAnterior}'
            AND cai_categoria IN ('VENDA','SERVICOS')            
            UNION ALL
            select 'Anteriores' as label,sum(cai_credito) AS valor from caixa 
            inner join vendas on replace(cai_id,'VEN ', '') = vendas.ven_codigo
            where
            cai_pagamento >= '${startMonth}' AND cai_pagamento <= '${endMonth}'
            AND ven_data < '${startMonthAnterior}'
            AND cai_categoria IN ('VENDA','SERVICOS')            
        `;
    } else if (req.params.tipo == 'pedidos') {
        query = `
            SELECT 'PAGO' as label,SUM(cai_credito+cai_debito) AS valor from caixa
            inner join vendas on replace(cai_id,'VEN ', '') = vendas.ven_codigo
            where
            cai_pagamento >= '${startMonth}' AND cai_pagamento <= '${endMonth}'
            AND ven_data >= '${startMonth}' AND ven_data <= '${endMonth}'
            AND cai_categoria IN ('VENDA','SERVICOS')            
            
        `;

    }
    firebirdConfig.Execute(query,
        (result) => {
            res.json(result)
        })
})
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))