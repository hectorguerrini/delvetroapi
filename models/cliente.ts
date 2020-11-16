interface Telefone {
	ID_TELEFONE_CLIENTE: number;
	TELEFONE: string;
}

export interface Cliente {
	ID_CLIENTE: number;
	NM_CLIENTE: string;
	ENDERECO: string;
	NUMERO: number;
	BAIRRO: string;
	CIDADE: string;
	CEP: string;
	ESTADO: string;
	TELEFONES: Array<Telefone> | string;
	RG: string;
	EMAIL: string;
	RAZAO_SOCIAL: string;
	NM_CONTATO: string;
	CPF: string;
	LOJISTA: number;
	COMPLEMENTO: string;
}
