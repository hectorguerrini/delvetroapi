import { DAO } from "./DAO";
import { Response, Request } from "express";
import { sign } from "jsonwebtoken";
import { Beneficiados } from "./models/beneficiados";
import { jwtSecret } from "./models/config";
export class Auth {

    constructor(private daoCtrl: DAO) { }

    public login(req: Request, res: Response): void {
        //Check if username and password are set
        let { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send();
            return
        }        
        
        // //Get user from database
        // const userRepository = getRepository(User);
        // let user: User;
        // try {
        //     user = await userRepository.findOneOrFail({ where: { username } });
        // } catch (error) {
        //     res.status(401).send();
        // }

        // //Check if encrypted password match
        // if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        //     res.status(401).send();
        //     return;
        // }
        
        const query = `
                SELECT * FROM DV_FUNCIONARIOS 
                WHERE USUARIO = '${username}' AND SENHA = '${password}'
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
                    { expiresIn: "10m" }
                );

                //Send the jwt in the response                
                res.json({
                    query: query,
                    json: result,
                    token: token
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