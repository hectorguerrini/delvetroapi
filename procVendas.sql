select distinct a.ven_codigo,ven_data,ven_hora,cai_pagamento,d.con_codigo,ven_responsavel,ven_total,
ven_status,vei_codigo,c.pro_codigo,pro_nome,pro_categoria,pro_setor,vei_med1 altura,vei_med2 largura,VEI_QTDE metro,
VEI_SUBQTDE qtde,
d.cai_codigo,cai_credito,cai_debito, cai_forma,cai_categoria
from vendas as a
left join vendasitens b on a.ven_codigo = b.ven_codigo
left join produtos c on c.pro_codigo = b.pro_codigo
inner join caixa d on d.cai_categoria IN ('VENDA','SERVICOS') and replace(d.cai_id,'VEN ', '')= a.ven_codigo
WHERE ven_data >= '01-31-2019' AND ven_data <= '01-31-2019'
ORDER BY VEN_DATA DESC, VEN_HORA DESC

select a.ven_codigo,ven_data,ven_hora,d.cai_codigo,cai_credito,cai_debito, cai_forma,cai_categoria from vendas as a
inner join caixa d on d.cai_categoria IN ('VENDA','SERVICOS') and replace(d.cai_id,'VEN ', '')= a.ven_codigo
WHERE ven_data >= '01-14-2019' AND ven_data <= '01-14-2019'
ORDER BY VEN_DATA DESC, VEN_HORA DESC

SELECT 1 as id, 'Pedidos' as label,sum(ven_total) as valor FROM vendas
where ven_data >= '01-01-2019' and ven_data <= '01-31-2019'
UNION ALL
SELECT 2 as id, 'Faturamento' as label,sum(cai_credito+cai_debito) as valor FROM caixa
where cai_pagamento >= '01-01-2019' and cai_pagamento <= '01-31-2019' and cai_categoria IN ('VENDA','SERVICOS')


SELECT ven_codigo,ven_responsavel,ven_total,SUM(cai_credito+cai_debito) AS valor,cai_pagamento FROM caixa
            inner join vendas on replace(cai_id,'VEN ', '') = vendas.ven_codigo
            where
             ven_data >= '02-01-2019' AND ven_data <= '02-28-2019'
            AND cai_categoria IN ('VENDA','SERVICOS')   
group by ven_codigo,ven_responsavel,cai_pagamento,ven_total
order by ven_codigo desc

select 
caixa.con_codigo,con_nome,sum(cai_credito)credito,sum(cai_debito)debito,
min(cai_data) primeiraCompra,max(cai_data) UltimoPedido,max(cai_pagamento) UltimoPagamento 
from caixa 
inner join contatos on contatos.con_codigo = caixa.con_codigo
where cai_categoria in ('VENDA','SERVICOS')
and cai_pagamento is not null
group by caixa.con_codigo,con_nome
order by credito desc

select 
caixa.con_codigo,con_nome,sum(cai_credito)credito,sum(cai_debito)debito,min(cai_data) primeiraCompra,
case when datediff(month,min(cai_data),'CURRENT_DATE') = 0 
then sum(cai_credito)
else
    sum(cai_credito)/datediff(month,min(cai_data),'CURRENT_DATE') 
end as creditoMes
from caixa 
inner join contatos on contatos.con_codigo = caixa.con_codigo
where cai_categoria in ('VENDA','SERVICOS')
and contatos.con_codigo not in (11865,12018,12026,11874)
and cai_pagamento is not null
group by caixa.con_codigo,con_nome
order by credito desc

SELECT 
caixa.con_codigo,con_nome,SUM(cai_credito)credito
FROM caixa 
INNER JOIN contatos ON contatos.con_codigo = caixa.con_codigo
WHERE cai_categoria IN ('VENDA','SERVICOS')
AND contatos.con_codigo NOT IN (11865,12018,12026,11874)
AND cai_pagamento IS NOT NULL
GROUP BY caixa.con_codigo,con_nome
ORDER BY credito DESC

-- select extract(year from cai_pagamento) || '/' || right('0'||extract(month from cai_pagamento),2) AS mes,
-- sum(cai_credito)valorCredito
-- from caixa
-- where con_codigo = 11836
-- and cai_pagamento is not null and cai_categoria in ('VENDA','SERVICOS')
-- group by mes
-- order by mes

select 'Pago'label,
sum(cai_credito)valor
from caixa
where 
con_codigo = 11836
and cai_pagamento is not null 
and cai_categoria in ('VENDA','SERVICOS')
union all
select 'pedido'label,
sum(ven_total)valor
from vendas
where con_codigo = 11836
union all 
select 'nome'label,con_nome valor
from contatos 
where con_codigo = 11836

select 
con_codigo,
con_nome 
from contatos
order by 2 asc