import { Router } from 'express';
import { Cadastros } from './cadastros';
import { DAO } from "./DAO";
export class Routes {
    public router: Router;
    private DAO: DAO;    
    private cadastroCtrl: Cadastros;
    constructor(){
        this.router = Router();
        this.Rotas();
        this.DAO = new DAO();
        this.cadastroCtrl = new Cadastros(this.DAO);

    }
    // Função de configuração das rotas
    Rotas(): void {
        this.router.get('/', (req, res) =>{
            res.send('Hello Delvetro!')
        });
        
        this.router.get('/combo/:tipo', (req, res) => this.cadastroCtrl.getCombo(req, res));
    }
    
}
