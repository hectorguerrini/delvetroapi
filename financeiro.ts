import { DAO } from "./DAO";
import { Request, Response } from "express";
import { Tabela } from "./models/tabela";
import { Despesa } from "./models/despesa";

export class Financeiro {

    constructor(private daoCtrl: DAO) {} 
    public salvarDespesa(req: Request, res: Response): void {
        let despesa: Despesa;
        despesa = req.body;
        const query = `
            EXEC sp_update_despesas
            @ID_DESPESA = ${despesa.ID_DESPESA}
            ,@NM_DESPESA = '${despesa.NM_DESPESA}'
            ,@VL_DESPESA = ${despesa.VL_DESPESA}
            ,@ID_CATEGORIA = ${despesa.ID_CATEGORIA}
            ,@ID_BENEFICIADO = ${despesa.ID_BENEFICIADO}
            ,@DT_VENCIMENTO = '${despesa.DT_VENCIMENTO}'
            ,@ID_FORMA_PGTO = ${despesa.ID_FORMA_PGTO}
            ,@DT_PGTO = ${despesa.DT_PGTO ? `'` + despesa.DT_PGTO + `'` : null}
            ,@STATUS_PGTO = '${despesa.STATUS_PGTO}'
            `;
        this.daoCtrl.queryDB<Despesa>(query, (err, result) => {
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
    public getDespesa(req: Request, res: Response): void {
        const query = `
            EXEC sp_get_despesas
            @ID_DESPESA = ${req.params.ID}
            `;
        this.daoCtrl.queryDB<Despesa>(query, (err, result) => {
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
    public getListaDespesas(req: Request, res: Response): void {
        console.log()
        const query = `
            EXEC sp_get_lista_despesas
            @FILTROS = '${JSON.stringify(req.body)}'
            `;
        this.daoCtrl.queryDB<Tabela>(query, (err, result) => {
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

    public getEventosCalendario(req: Request, res: Response): void {
        const query = `
            EXEC sp_get_eventos_calendario
            @DATA = '${req.body.data}'
            `;
        this.daoCtrl.queryDB<any>(query, (err, result) => {
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