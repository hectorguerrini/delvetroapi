import * as moment from 'moment';
import { Request, Response} from 'express';
import { DAO } from './DAO';
import { Combo } from './models/combo';
import { Beneficiados } from './models/beneficiados';
import { Cliente } from './models/cliente';
import { Servico } from './models/servico';


export class Cadastros {    

    constructor(private daoCtrl: DAO){        
    }

    public getCombo(req: Request, res: Response): void {

        const query = `EXEC sp_get_combo @COMBO='${req.params.tipo}'`;

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
    public salvarCliente(req: Request, res: Response): void {
        let cliente: Cliente;
        cliente = req.body;  
        console.log(cliente)      
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
			@RAZAO_SOCIAL = '${beneficiado.RAZAO_SOCIAL}',
			@ID_FUNCIONARIO = ${beneficiado.ID_FUNCIONARIO},
			@RG = '${beneficiado.RG}',
			@CARGO = '${beneficiado.CARGO}',
			@SUPERVISOR = ${beneficiado.SUPERVISOR},
			@USUARIO = '${beneficiado.USUARIO}',
			@SENHA = ${beneficiado.SENHA},	
			@SALARIO = ${beneficiado.SALARIO},
			@DT_CONTRATACAO = '${beneficiado.DT_CONTRATACAO}'
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

}
