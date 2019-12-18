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
}