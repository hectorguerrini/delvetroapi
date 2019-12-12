import { Router } from 'express';
import { Cadastros } from './cadastros';
import { DAO } from "./DAO";
import { Vendas } from './vendas';
import { Financeiro } from './financeiro';
import { Auth } from './auth';
import { Jwt } from './middleware/jwt';
import { Acompanhamento } from './acompanhamento';
import { Utilitarios } from './utilitarios';
export class Routes {
    public router: Router;
    private DAO: DAO;    
    private cadastroCtrl: Cadastros;
    private vendasCtrl: Vendas;
    private financeiroCtrl: Financeiro;
    private authCtrl: Auth;    
    private acompanhamentoCtrl: Acompanhamento;
    private utilitariosCtrl: Utilitarios;
    constructor(){
        this.router = Router();
        this.Rotas();
        this.DAO = new DAO();
        this.cadastroCtrl = new Cadastros(this.DAO);
        this.vendasCtrl = new Vendas(this.DAO);
        this.financeiroCtrl = new Financeiro(this.DAO);
        this.authCtrl = new Auth(this.DAO);        
        this.acompanhamentoCtrl = new Acompanhamento(this.DAO);
        this.utilitariosCtrl = new Utilitarios(this.DAO);
    }
    // Função de configuração das rotas
    Rotas(): void {
        
        // GET
        this.router.get('/', (req, res) =>{
            res.send('Hello Delvetro!')
        });
        this.router.get('/combo/:tipo', Jwt.checkJwt, (req, res) => this.cadastroCtrl.getCombo(req, res));
        this.router.get('/cliente/:ID', Jwt.checkJwt, (req, res) => this.cadastroCtrl.getCadastroCliente(req, res));
        this.router.get('/servico/:ID', Jwt.checkJwt, (req, res) => this.cadastroCtrl.getCadastroServico(req, res));
        this.router.get('/estoque/:ID', Jwt.checkJwt, (req, res) => this.cadastroCtrl.getCadastroEstoque(req, res));
        this.router.get('/produto/:ID', Jwt.checkJwt, (req, res) => this.cadastroCtrl.getCadastroProduto(req, res));
        this.router.get('/beneficiado/:ID', Jwt.checkJwt, (req, res) => this.cadastroCtrl.getCadastroBeneficiado(req, res));
        this.router.get('/listaVendas/:ID', Jwt.checkJwt, (req, res) => this.vendasCtrl.getListaVenda(req, res));
        this.router.get('/venda/:ID', Jwt.checkJwt, (req, res) => this.vendasCtrl.getVenda(req, res));
        this.router.get('/detalhesVenda/:ID_CLIENTE/:ID_VENDA', Jwt.checkJwt, (req, res) => this.vendasCtrl.getVendaRecebimento(req, res));
        this.router.get('/despesa/:ID', Jwt.checkJwt, (req, res) => this.financeiroCtrl.getDespesa(req, res));        
        this.router.get('/listUsers', Jwt.checkJwt,(req, res) => this.authCtrl.listUsers(req,res));        
        
        //POST
        this.router.post('/cliente', Jwt.checkJwt, (req, res) => this.cadastroCtrl.salvarCliente(req, res));
        this.router.post('/servico', Jwt.checkJwt, (req, res) => this.cadastroCtrl.salvarServico(req, res));
        this.router.post('/estoque', Jwt.checkJwt, (req, res) => this.cadastroCtrl.salvarEstoque(req, res));
        this.router.post('/produto', Jwt.checkJwt, (req, res) => this.cadastroCtrl.salvarProduto(req, res));
        this.router.post('/beneficiado', Jwt.checkJwt, (req, res) => this.cadastroCtrl.salvarBeneficiado(req, res));
        this.router.post('/venda', Jwt.checkJwt, (req, res) => this.vendasCtrl.salvarVenda(req, res));
        this.router.post('/pagamento', Jwt.checkJwt, (req, res) => this.vendasCtrl.salvarPagamento(req, res));
        this.router.post('/listaDespesas', Jwt.checkJwt, (req, res) => this.financeiroCtrl.getListaDespesas(req, res));
        this.router.post('/eventosCalendario', Jwt.checkJwt, (req, res) => this.financeiroCtrl.getEventosCalendario(req, res));
        this.router.post('/despesa', Jwt.checkJwt, (req, res) => this.financeiroCtrl.salvarDespesa(req, res));        
        this.router.post('/itens', Jwt.checkJwt, (req, res) => this.acompanhamentoCtrl.getItens(req, res));
        this.router.post('/itens/status', Jwt.checkJwt, (req, res) => this.acompanhamentoCtrl.updateStatusItens(req, res));
        this.router.post('/itens/entrega', Jwt.checkJwt, (req, res) => this.utilitariosCtrl.gerarRelatorio(req,res));        
        this.router.post('/login', (req, res) => this.authCtrl.login(req,res));        
        this.router.post('/refreshToken', Jwt.refreshToken);

    }   
    
}
