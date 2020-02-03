import { Request, Response} from 'express';
import { DAO } from './DAO';
import { Itens } from './models/itens';


export class Acompanhamento {    

    constructor(private daoCtrl: DAO){        
    }
    public getItens(req: Request, res: Response): void {
       

        this.daoCtrl.queryDBTable<Itens>('sp_get_acompanhamento_itens',req, (err, result) => {
            if (err) {
                console.dir(err);
                return;
            }
            if (result){
                res.json({                    
                    json: result.recordset,
                    tableSize: result.output.TOTAL
                });
            } else {
                res.json({
                    json: []                    
                });
            }
        })
    } 
    public updateStatusItens(req: Request, res: Response): void {

        const query = `EXEC sp_update_status_itens @ITENS = '${JSON.stringify(req.body)}', @ID_FUNCIONARIO = ${res.locals.userId}`;

        this.daoCtrl.queryDB<{ID_ITEM_VENDIDO: number, STATUS: string}>(query, (err, result) => {
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
    public getTrackingItem(req: Request, res: Response): void {

        const query = `SELECT * FROM DV_LOG_ITENS_VENDIDOS WHERE ID_VENDIDO = ${req.params.ID}`;

        this.daoCtrl.queryDB<any>(query, (err, result) => {
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

    public getEstoque(req: Request, res: Response): void {
       

        this.daoCtrl.queryDBTable<Itens>('sp_get_acompanhamento_estoque',req, (err, result) => {
            if (err) {
                console.dir(err);
                return;
            }
            if (result){
                res.json({                    
                    json: result.recordset,
                    tableSize: result.output.TOTAL
                });
            } else {
                res.json({
                    json: []                    
                });
            }
        })
    }
	public updateQtdeEstoque(req: Request, res: Response): void {

		const query = `EXEC sp_update_log_estoque 
			@ID_ESTOQUE = ${req.body.ID_ESTOQUE},
			@MOTIVO = '${req.body.MOTIVO}',
			@VALOR = ${req.body.VALOR},		
			@ID_FUNCIONARIO = ${res.locals.userId}
			`;

        this.daoCtrl.queryDB<any>(query, (err, result) => {
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
	public getLogEstoque(req: Request, res: Response): void {

        const query = `
			SELECT 
				ID_LOG_ESTOQUE,
				DT_ALTERACAO,
				MOTIVO,
				DELTA,
				ID_FUNCIONARIO
			FROM 
				DV_LOG_ESTOQUE
			WHERE 
				ID_ESTOQUE = ${req.params.ID}`;

        this.daoCtrl.queryDB<any>(query, (err, result) => {
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

}