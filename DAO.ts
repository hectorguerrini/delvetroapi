import { ConnectionPool, config, IRecordSet } from 'mssql';
import { configDev} from './models/config';
export class DAO {
    private configDev = configDev;
    constructor(){}

    queryDB<Entity>(query: string, callback: (err?: Error, recordset?: IRecordSet<Entity>) => void){

        const pool =  new ConnectionPool(this.configDev).connect()
            .then(pool => {
                return pool.query(query);
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

}