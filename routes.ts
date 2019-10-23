import { Router } from 'express';
import { Cadastros } from './cadastros';
import { DAO } from "./DAO";
import { Vendas } from './vendas';
export class Routes {
    public router: Router;
    private DAO: DAO;    
    private cadastroCtrl: Cadastros;
    private vendasCtrl: Vendas;
    constructor(){
        this.router = Router();
        this.Rotas();
        this.DAO = new DAO();
        this.cadastroCtrl = new Cadastros(this.DAO);
        this.vendasCtrl = new Vendas(this.DAO);
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
        this.router.get('/produto/:ID', (req, res) => this.cadastroCtrl.getCadastroProduto(req, res));
        this.router.get('/listaVendas/:ID', (req, res) => this.vendasCtrl.getListaVenda(req, res));
        this.router.get('/venda/:ID', (req, res) => this.vendasCtrl.getVenda(req, res));
        this.router.get('/detalhesVenda/:ID_CLIENTE/:ID_VENDA', (req, res) => this.vendasCtrl.getVendaRecebimento(req, res));

        //POST
        this.router.post('/cliente', (req, res) => this.cadastroCtrl.salvarCliente(req, res));
        this.router.post('/servico', (req, res) => this.cadastroCtrl.salvarServico(req, res));
        this.router.post('/estoque', (req, res) => this.cadastroCtrl.salvarEstoque(req, res));
        this.router.post('/produto', (req, res) => this.cadastroCtrl.salvarProduto(req, res));
        this.router.post('/beneficiado', (req, res) => this.cadastroCtrl.salvarBeneficiado(req, res));
        this.router.post('/venda', (req, res) => this.vendasCtrl.salvarVenda(req, res));
        this.router.post('/pagamento', (req, res) => this.vendasCtrl.salvarPagamento(req, res));
    }
    
}
