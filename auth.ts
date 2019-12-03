import { DAO } from "./DAO";
import { Response, Request } from "express";
import { sign } from "jsonwebtoken";
import { Beneficiados } from "./models/beneficiados";
import { jwtSecret } from "./models/config";
export class Auth {

    constructor(private daoCtrl: DAO) { }

    public login(req: Request, res: Response): void {
        //Check if username and password are set
        let { usuario, password } = req.body;
        if (!(usuario && password)) {
            res.status(400).send();
            return
        }        
              
        const query = `
                SELECT * FROM DV_FUNCIONARIOS 
                WHERE USUARIO = '${usuario}' AND SENHA = '${password}'
            `;

        this.daoCtrl.queryDB<Beneficiados>(query, (err, result) => {
            if (err) {
                console.dir({
                    error: err,
                    query: query
                })
                res.status(500).json({
                    name: err.name,
                    message: err.message
                });
                return;
            }
            if (result) {                
                //Sing JWT, valid for 1 hour
                const token = sign(
                    { userId: result[0].ID_FUNCIONARIO, username: result[0].USUARIO },
                    jwtSecret,
                    { expiresIn: "2m" }
                );
                const refreshtoken = sign(
                    { userId: result[0].ID_FUNCIONARIO, username: result[0].USUARIO },
                    jwtSecret,
                    { expiresIn: "1h" }
                );

                //Send the jwt in the response                
                res.json({
                    id_usuario: result[0].ID_FUNCIONARIO,
                    accessToken: token,
                    refreshToken: refreshtoken
                });
            } else {
                res.json({
                    query: query
                });
            }
        })
    }

    public listUsers(req: Request, res: Response) {
        const query = `SELECT * FROM DV_FUNCIONARIOS`;
        
        this.daoCtrl.queryDB<Beneficiados>(query, (err, result) => {
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