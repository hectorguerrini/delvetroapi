import { Request, Response} from 'express';
import { DAO } from './DAO';
import { Combo } from './models/combo';
import { Beneficiados } from './models/beneficiados';
import { Cliente } from './models/cliente';
import { Servico } from './models/servico';
import { Estoque } from './models/estoque';
import { Produto } from './models/produto';


export class Cadastros {    

    constructor(private daoCtrl: DAO){        
    }

    public getCombo(req: Request, res: Response): void {

        const query = `EXEC sp_get_combo @COMBO='${req.params.tipo}'`;
		console.dir(`User: ${res.locals.userId}` );
        this.daoCtrl.queryDB<Combo>(query, (err, result) => {
            if (err) {
                console.dir(err);
                return;
            }
            if (result){
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query                    
                });
            }
        })
    }

    // Cadastro Estoque
    public getCadastroEstoque(req: Request, res: Response): void {
        const query = `
            EXEC sp_get_estoque
            @ID_ESTOQUE = ${req.params.ID}
        `;
        this.daoCtrl.queryDB<Estoque>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })      
                return;
            }
            if (result){                
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query                    
                });
            }
        })
    }
    public salvarEstoque(req: Request, res: Response): void {
        let estoque: Estoque;
        estoque = req.body;          
        const query = `
			EXEC sp_update_cadastro_estoque
			@ID_ESTOQUE = ${estoque.ID_ESTOQUE},
            @ID_TIPO = '${estoque.ID_TIPO}',
            @DESCRICAO = '${estoque.DESCRICAO}',
            @QTDE = ${estoque.QTDE},
            @UNIDADE = '${estoque.UNIDADE}',
            @LOCALIZACAO = '${estoque.LOCALIZACAO}',
            @ESTOQUE_MIN = ${estoque.ESTOQUE_MIN},
            @ESTOQUE_MAX = ${estoque.ESTOQUE_MAX},
            @CUSTO_ULTIMO_RECEBIMENTO = ${estoque.CUSTO_ULTIMO_RECEBIMENTO},
			@ESPESSURA = ${estoque.ESPESSURA},
			@ID_FUNCIONARIO = ${res.locals.userId}
            `;

        this.daoCtrl.queryDB<Estoque>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })                
                return;
            }
            if (result) {               
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query
                });
            }
        })
    }

    // Cadastro Cliente
    public getCadastroCliente(req: Request, res: Response): void {
        const query = `
            EXEC sp_get_cadastro_cliente
            @ID_CLIENTE = ${req.params.ID}
        `;
        this.daoCtrl.queryDB<Cliente>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })      
                return;
            }
            if (result){
                if (result.length > 0)
                    result[0].TELEFONES = <string>result[0].TELEFONES ? JSON.parse(<string>result[0].TELEFONES) : []; 
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query                    
                });
            }
        })
    }
    public salvarCliente(req: Request, res: Response): void {
        let cliente: Cliente;
        cliente = req.body;    
        const query = `
            EXEC sp_update_cadastro_clientes
            @ID_CLIENTE = ${cliente.ID_CLIENTE},
            @NM_CLIENTE = '${cliente.NM_CLIENTE ? cliente.NM_CLIENTE : ''}',
            @ENDERECO = '${cliente.ENDERECO}',
            @NUMERO = ${cliente.NUMERO},
            @BAIRRO = '${cliente.BAIRRO}',
            @CIDADE = '${cliente.CIDADE}',
            @CEP = '${cliente.CEP}',
            @ESTADO = '${cliente.ESTADO}',
            @TELEFONES = '${cliente.TELEFONES ? JSON.stringify(cliente.TELEFONES) : []}',
            @RG = '${cliente.RG}',
            @EMAIL = '${cliente.EMAIL}',
            @RAZAO_SOCIAL = '${cliente.RAZAO_SOCIAL}',
            @NM_CONTATO = '${cliente.NM_CONTATO}',
            @CPF = '${cliente.CPF}',
            @LOJISTA = ${cliente.LOJISTA},
            @COMPLEMENTO = ${cliente.COMPLEMENTO}
            `;

        this.daoCtrl.queryDB<Cliente>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })                
                return;
            }
            if (result) {
                if (result.length > 0)
                    result[0].TELEFONES = <string>result[0].TELEFONES ? JSON.parse(<string>result[0].TELEFONES) : []; 
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query
                });
            }
        })
    }

    // Cadastro Serviço
    public getCadastroServico(req: Request, res: Response): void {
        const query = `
        EXEC sp_get_servico
        @ID_SERVICO = ${req.params.ID}
        `;
        this.daoCtrl.queryDB<Servico>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })      
                return;
            }
            if (result){               
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query                    
                });
            }
        })
    }
    public salvarServico(req: Request, res: Response): void {
        let servico: Servico;
        servico = req.body;        
        const query = `
            EXEC sp_update_cadastro_servico
            @ID_SERVICO = ${servico.ID_SERVICO},
            @ID_TIPO = ${servico.ID_TIPO},
            @UNIDADE_CUSTO = '${servico.UNIDADE_CUSTO}',
            @CUSTO_POR_UNIDADE = ${servico.CUSTO_POR_UNIDADE},
            @PRZ_CONCLUSAO = ${servico.PRZ_CONCLUSAO},
            @OBS = '${servico.OBS}',
            @ID_BENEFICIADO = ${servico.ID_BENEFICIADO},
            @DESCRICAO = '${servico.DESCRICAO}',
            @EXTERNO = ${servico.EXTERNO}
        `;
        this.daoCtrl.queryDB<Servico>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })                
                return;
            }
            if (result) {
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query
                });
            }
        })
    }

    // Cadastro Produto
    public getCadastroProduto(req: Request, res: Response): void {
        const query = `
            EXEC sp_get_produtos
            @ID_PRODUTOS = ${req.params.ID}
            `;
        this.daoCtrl.queryDB<Produto>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })      
                return;
            }
            if (result){               
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query                    
                });
            }
        })
    }
    public salvarProduto(req: Request, res: Response): void {
        let produto: Produto;
        produto = req.body;        
        const query = `
            EXEC sp_update_cadastro_produto
            @ID_PRODUTO = ${produto.ID_PRODUTO},
            @NM_PRODUTO = '${produto.NM_PRODUTO}',
            @TIPO = '${produto.TIPO}',
            @UNIDADE_VENDA = '${produto.UNIDADE_VENDA}',
            @PRECO_UNITARIO = ${produto.PRECO_UNITARIO},
            @PRZ_ENTREGA = ${produto.PRZ_ENTREGA},
            @CUSTO = ${produto.CUSTO},
            @COMPOSICAO = '${produto.COMPOSICAO ? JSON.stringify(produto.COMPOSICAO) : []}'
            `;
        this.daoCtrl.queryDB<Produto>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })                
                return;
            }
            if (result) {
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query
                });
            }
        })
    }
    
    // Cadastro Beneficiado
    public salvarBeneficiado(req: Request, res: Response): void {
        let beneficiado: Beneficiados;
        beneficiado = req.body;        
        const query = `
		    EXEC sp_update_cadastro_beneficiado
			@ID_BENEFICIADO = ${beneficiado.ID_BENEFICIADO},
			@NM_BENEFICIADO = '${beneficiado.NM_BENEFICIADO}',
			@TIPO_BENEFICIADO = '${beneficiado.TIPO_BENEFICIADO}',
			@CPF = '${beneficiado.CPF}',
			@CNPJ = '${beneficiado.CNPJ}',
			@RAZAO_SOCIAL = '${beneficiado.RAZAO_SOCIAL}'
            ${beneficiado.TIPO_BENEFICIADO === 'Funcionario' ? `
                ,@ID_FUNCIONARIO = ${beneficiado.ID_FUNCIONARIO},
                @RG = '${beneficiado.RG}',
                @CARGO = '${beneficiado.CARGO}',
                @SUPERVISOR = '${beneficiado.SUPERVISOR}',
                @USUARIO = '${beneficiado.USUARIO}',
                @SENHA = '${beneficiado.SENHA}',	
                @SALARIO = ${beneficiado.SALARIO},
                @DT_CONTRATACAO = '${beneficiado.DT_CONTRATACAO}'
                
                ` : ''}
			`;

        this.daoCtrl.queryDB<Beneficiados>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })                
                return;
            }
            if (result) {
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query
                });
            }
        })
    }
    public getCadastroBeneficiado(req: Request, res: Response): void {
        const query = `
            EXEC sp_get_beneficiado
            @ID_BENEFICIADO = ${req.params.ID}
            `;
        this.daoCtrl.queryDB<Produto>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })      
                return;
            }
            if (result){               
                res.json({
                    query: query,
                    json: result
                });
            } else {
                res.json({
                    query: query                    
                });
            }
        })
    }

}
