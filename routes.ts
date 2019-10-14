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
        
        // GET
        this.router.get('/', (req, res) =>{
            res.send('Hello Delvetro!')
        });
        this.router.get('/combo/:tipo', (req, res) => this.cadastroCtrl.getCombo(req, res));
        this.router.get('/cliente/:ID', (req, res) => this.cadastroCtrl.getCadastroCliente(req, res));
        this.router.get('/servico/:ID', (req, res) => this.cadastroCtrl.getCadastroServico(req, res));
        this.router.get('/estoque/:ID', (req, res) => this.cadastroCtrl.getCadastroEstoque(req, res));

        //POST
        this.router.post('/cliente', (req, res) => this.cadastroCtrl.salvarCliente(req, res));
        this.router.post('/servico', (req, res) => this.cadastroCtrl.salvarServico(req, res));
        this.router.post('/beneficiado', (req, res) => this.cadastroCtrl.salvarBeneficiado(req, res));
    }
    
}
