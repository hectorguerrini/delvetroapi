import { DAO } from "./DAO";
import { Request, Response } from "express";
import { VendasLista } from "./models/vendasLista";
import { Venda } from "./models/venda";
import { detalheVenda } from "./models/detalhe-venda";
import { Pagamento } from "./models/pagamento";
export class Vendas {

    constructor(private daoCtrl: DAO) {}

    public getListaVenda(req: Request, res: Response): void {
        const query = `
            EXEC sp_get_vendas
            @ID_CLIENTE = ${req.params.ID}
            `;
        this.daoCtrl.queryDB<VendasLista>(query, (err, result) => {
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

    public getVenda(req: Request, res: Response): void {
        const query = `
            EXEC sp_get_cadastro_venda
            @ID_VENDA = ${req.params.ID}
            `;
        this.daoCtrl.queryDB<Venda>(query, (err, result) => {
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

    public salvarVenda(req: Request, res: Response): void {
        let venda: Venda;
        venda = req.body;
        const query = `
            EXEC sp_update_cadastro_venda
            @jsonVariable= '${JSON.stringify(venda)}',
            @ID_FUNCIONARIO = ${res.locals.userId}
            `;
        this.daoCtrl.queryDB<Venda>(query, (err, result) => {
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

    public getVendaRecebimento(req: Request, res: Response): void {
        const query = `
            EXEC sp_get_venda_recebimento
            @ID_CLIENTE = ${req.params.ID_CLIENTE},
            @ID_VENDA = ${req.params.ID_VENDA}
            `;
        this.daoCtrl.queryDB<detalheVenda>(query, (err, result) => {
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

    public salvarPagamento(req: Request, res: Response): void {
        let pagamento: Pagamento;
        pagamento = req.body;
        const query = `
            EXEC sp_update_pagamento_venda
            @pagamentos = '${JSON.stringify(pagamento)}'
            `;
        this.daoCtrl.queryDB<Pagamento>(query, (err, result) => {
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