interface ServicosExtras {
	ID_PRODUTO: number;
	ID_ITEM_VENDIDO: number;
	DESCRICAO: string;
	QUANTIDADE: number;
	PRECO_FINAL: number;
	PRECO_UNITARIO: number;
}

interface ItensVendidos {
	ID_PRODUTO: number;
	TIPO: string;
	NM_PRODUTO: string;
	QTDE: number;
	LARGURA: number;
	ALTURA: number;
	AREA: number;
	LARGURA_CONSIDERADA: number;
	ALTURA_CONSIDERADA: number;
	AREA_CONSIDERADA: number;
	PRECO_FINAL: number;
	PRECO_UNITARIO: number;
	EXTRAS: Array<ServicosExtras>;
}

export interface Venda {
	ID_VENDA: number;
	ID_CLIENTE: number;
	NM_CLIENTE: string;
	PRECO_FINAL: number;
	STATUS_VENDA: string;
	QTD_PRODUTOS: number;
	ITENS: Array<ItensVendidos>;
	PRODUTOS: Array<ItensVendidos>;
	// PGTO: Array<Pagamento>;
}
