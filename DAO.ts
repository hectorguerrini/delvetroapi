import { ConnectionPool, config, IRecordSet, Int, VarChar, MAX, IProcedureResult } from 'mssql';
import { configDev} from './models/config';
import { Request} from 'express';
export class DAO {
    private configDev = configDev;
    constructor(){}

    queryDB<Entity>(query: string, callback: (err?: Error, recordset?: IRecordSet<Entity>) => void){

        const pool =  new ConnectionPool(this.configDev).connect()
            .then(pool => {
                return pool.request().query(query);
            }).then(result => {                
                callback(undefined, result.recordset);
            }).catch(err => {
                callback(err, undefined);
            })

        // const pool = new ConnectionPool(this.configDev,(err: any) => {
        //     if (err) {
        //         console.error("error connecting: " + err.stack);
        //         callback(err);
        //     }

        //     const conn = new Request(pool);
        //     conn.query(query, function (error, result) {
        //         if (error) {
        //             console.dir(error);
        //             callback(error);                
        //         }
        //         callback(error, result)
        //     });

        // })
    }
    queryDBTable<Entity>(procedure: string,req: Request, callback: (err?: Error, recordset?: IProcedureResult<Entity>) => void){

        const pool =  new ConnectionPool(this.configDev).connect()
            .then(pool => {
                return pool.request()
                        .input('FILTROS', VarChar(MAX), JSON.stringify(req.body.filtros))  
                        .input('PAGE',VarChar(MAX), JSON.stringify(req.body.paginacao))
                        .output('TOTAL', Int)
                        .execute(procedure);
            }).then(result => {
                console.log(result.output);
                callback(undefined, result);
            }).catch(err => {
                callback(err, undefined);
            })

        // const pool = new ConnectionPool(this.configDev,(err: any) => {
        //     if (err) {
        //         console.error("error connecting: " + err.stack);
        //         callback(err);
        //     }

        //     const conn = new Request(pool);
        //     conn.query(query, function (error, result) {
        //         if (error) {
        //             console.dir(error);
        //             callback(error);                
        //         }
        //         callback(error, result)
        //     });

        // })
    }
}