import { Request, Response, NextFunction } from "express";
import { verify, sign } from "jsonwebtoken";
import { jwtSecret } from "../models/config";


export class Jwt {

    constructor() { }

    public static checkJwt(req: Request, res: Response, next: NextFunction) {

        //Get the jwt token from the head
        const token = <string>(req.headers.authorization ? req.headers.authorization.split(' ')[1] : '');
        let jwtPayload;
        console.log('token:', token);
        
        //Try to validate the token and get data
        try {
            jwtPayload = <any>verify(token, jwtSecret);
            console.log('jwtPay:', jwtPayload);
            res.locals.jwtPayload = jwtPayload;
        } catch (error) {
            //If token is not valid, respond with 401 (unauthorized)
            res.status(401).json(
                {
                    err: error,
                    tokenHeader: token
                });
            return;
        }

        //The token is valid for 1 hour
        //We want to send a new token on every request
        // const { userId, username } = jwtPayload;
        // const newToken = sign({ userId, username }, jwtSecret, {
        //     expiresIn: "10m"
        // });
        // res.setHeader("token", newToken);

        //Call the next middleware or controller
        next();
    };
    public static refreshToken(req: Request, res: Response, next: NextFunction) {
        //Get the jwt token from the head
        const token = req.body.refreshToken;
        let jwtPayload;
        console.log('token:', token);
        //Try to validate the token and get data
        try {
            jwtPayload = <any>verify(token, jwtSecret);
            console.log('jwtPay:', jwtPayload);
            res.locals.jwtPayload = jwtPayload;
        } catch (error) {
            //If token is not valid, respond with 401 (unauthorized)
            res.status(401).json(
                {
                    err: error,
                    tokenHeader: token
                });
            return;
        }

        //The token is valid for 1 hour
        //We want to send a new token on every request
        const { userId, username } = jwtPayload;
        const newToken = sign({ userId, username }, jwtSecret, {
            expiresIn: "2m"
        });
        res.json({accessToken: newToken});

        //Call the next middleware or controller
        next();
    }
}
