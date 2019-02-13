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

