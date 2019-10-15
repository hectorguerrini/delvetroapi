import { DAO } from "./DAO";
import { Request, Response } from "express";
import { VendasLista } from "./models/vendasLista";
import { Venda } from "./models/venda";
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
            @jsonVariable= '${JSON.stringify(venda)}'
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
}