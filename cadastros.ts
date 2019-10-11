import * as moment from 'moment';
import { Request, Response} from 'express';
import { DAO } from './DAO';
import { Combo } from './models/combo';
// const querySql = require('./mssqlConfig')();

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
    // public getCombo(req: Request, res: Response): void {

    //     const query = `EXEC sp_get_combo @COMBO='${req.params.tipo}'`;

    //     querySql.queryDB(query, (err: any, result: any) => {
            // if (err) {
            //     console.dir(err);
            //     return;
            // }
            // res.json({
            //     query: query,
            //     json: result
            // });
    //     });
    // }

}
