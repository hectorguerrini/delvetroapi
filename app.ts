import express = require('express');
import { json } from 'body-parser';
import cors from 'cors';

import { Routes } from './routes';

import { corsConfig } from './models/cors-config';
import helmet from "helmet";


export default class App {
    public app: express.Application;
    public routes: Routes = new Routes();
    constructor() {
        this.app = express();
        this.config();                    
    }

    private config(): void {
        
        const corsopt = new corsConfig();
        this.app.use(json());
        this.app.use(helmet())
        this.app.use(cors(corsopt.options));

        this.app.use('/delvetroapi', this.routes.router);
    }
    
}




