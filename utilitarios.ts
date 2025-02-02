import { DAO } from "./DAO";
import { Request, Response } from "express";
// import PDFDocument = require('pdfkit');
import doc from 'pdfkit';
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { Itens } from "./models/itens";
import moment from 'moment';
import { IncomingForm } from "formidable";
export class Utilitarios {
    private pdfWidth: number = 595;
    private pdfHeight: number = 842;
    private dirNameArquivos: string = "C:/inetpub/wwwroot/arquivos/relatorios";
    constructor(private daoCtrl: DAO) { }

    returnSizePercentW(percent: number): number {
        return this.pdfWidth * (percent / 100);
    }
    returnSizePercentH(percent: number): number {
        return this.pdfHeight * (percent / 100);
    }
    public gerarPdf(path: string, itens: Array<Itens>, funcionario: string, dados: {tipo: string, ID: number, descricao: string }): Promise<string> {
        let promise = new Promise<string>((res, rej) => {
            // PDF size 595 X 842
            let pdf = new doc;
            const writeStream = createWriteStream(path);
            pdf.pipe(writeStream);
            pdf.page.margins = {bottom:0,top:0,left:0,right:0}
            pdf.image('assets/logo2.png', this.returnSizePercentW(5), this.returnSizePercentH(4), { fit: [100, 100] });

            // Font Bold Titles
            pdf.font('Times-Bold');

            pdf.fontSize(16).text(`Data/Hora: ${moment().format('DD/MM/YYYY hh:mm')}`, this.returnSizePercentW(0), this.returnSizePercentH(4), {
                width: this.pdfWidth,
                align: 'center'
            });
            pdf.fontSize(12).text(`Dados ${dados.tipo}`, this.returnSizePercentW(5), this.returnSizePercentH(15));
            pdf.fontSize(12).text(`Itens ${dados.tipo}`, this.returnSizePercentW(5), this.returnSizePercentH(23));
            // Header Tabela
            pdf.fontSize(12).text('PRODUTO', this.returnSizePercentW(5), this.returnSizePercentH(26));
            pdf.fontSize(12).text('QTDE', this.returnSizePercentW(60), this.returnSizePercentH(26));
            pdf.fontSize(12).text('MEDIDAS', this.returnSizePercentW(70), this.returnSizePercentH(26));
            // pdf.fontSize(12).text('METROS', this.returnSizePercentW(85), this.returnSizePercentH(26), { width: this.returnSizePercentW(15) });

            // pdf.fontSize(16).text('Nº Pedido: 1002', this.returnSizePercentW(4), this.returnSizePercentH(4)+80);
            // Font Regular
            pdf.font('Times-Roman');
            if (dados.tipo === 'Venda'){
                pdf.fontSize(10).text(`CLIENTE: ${dados.ID} - ${dados.descricao}`, this.returnSizePercentW(5), this.returnSizePercentH(17));
            } else if (dados.tipo === 'Serviço') {
                pdf.fontSize(10).text(`SERVIÇO: ${dados.ID} - ${dados.descricao}`, this.returnSizePercentW(5), this.returnSizePercentH(17));
            }
            
            pdf.fontSize(10).text(`FUNCIONARIO: ${funcionario.toUpperCase()}`, this.returnSizePercentW(5), this.returnSizePercentH(18.5));

            //Body Tabela
            let hInicial = 28;
            itens.forEach(item => {
                pdf.fontSize(10).text(`${item.ID_ITEM_VENDIDO} - ${item.NM_PRODUTO}`, this.returnSizePercentW(5), this.returnSizePercentH(hInicial));
                pdf.fontSize(10).text(`${item.QTDE}`, this.returnSizePercentW(60), this.returnSizePercentH(hInicial));
                pdf.fontSize(10).text(`${ item.ALTURA ? `${item.LARGURA} X ${item.ALTURA}` : '' }`, this.returnSizePercentW(70), this.returnSizePercentH(hInicial));
                // pdf.fontSize(10).text(`${}`, this.returnSizePercentW(85), this.returnSizePercentH(hInicial), { width: this.returnSizePercentW(15) });

                pdf.moveTo(this.returnSizePercentW(5), this.returnSizePercentH(hInicial + 2))
                    .lineTo(this.returnSizePercentW(100), this.returnSizePercentH(hInicial + 2)).dash(5, { space: 5 }).stroke();
                hInicial += 3;                
                if (hInicial >= 80) {
                    pdf.fontSize(12).text('Assinatura Cliente,', this.returnSizePercentW(5), this.returnSizePercentH(hInicial + 6));

                    pdf.moveTo(this.returnSizePercentW(25), this.returnSizePercentH(hInicial + 7))
                        .lineTo(this.returnSizePercentW(60), this.returnSizePercentH(hInicial + 7)).dash(5, { space: 5 }).stroke();
        
                    pdf.fontSize(12).text('Data:____/____/____', this.returnSizePercentW(70), this.returnSizePercentH(hInicial + 6));
                    pdf.addPage({margins: {bottom:0,top:0,left:0,right:0}});
                    pdf.image('assets/logo2.png', this.returnSizePercentW(5), this.returnSizePercentH(4), { fit: [100, 100] });

                    // Font Bold Titles
                    pdf.font('Times-Bold');

                    pdf.fontSize(16).text(`Data/Hora Entrega: ${moment().format('DD/MM/YYYY hh:mm')}`, this.returnSizePercentW(0), this.returnSizePercentH(4), {
                        width: this.pdfWidth,
                        align: 'center'
                    });
                    pdf.fontSize(12).text('Dados Da Venda', this.returnSizePercentW(5), this.returnSizePercentH(15));
                    pdf.fontSize(12).text('Itens Da Venda', this.returnSizePercentW(5), this.returnSizePercentH(23));
                    // Header Tabela
                    pdf.fontSize(12).text('PRODUTO', this.returnSizePercentW(5), this.returnSizePercentH(26));
                    pdf.fontSize(12).text('QTDE', this.returnSizePercentW(60), this.returnSizePercentH(26));
                    pdf.fontSize(12).text('MEDIDAS', this.returnSizePercentW(70), this.returnSizePercentH(26));
                    // pdf.fontSize(12).text('METROS', this.returnSizePercentW(85), this.returnSizePercentH(26), { width: this.returnSizePercentW(15) });

                    // pdf.fontSize(16).text('Nº Pedido: 1002', this.returnSizePercentW(4), this.returnSizePercentH(4)+80);
                    // Font Regular

                    
                    pdf.font('Times-Roman');
                    pdf.fontSize(10).text(`CLIENTE: ${itens[0].ID_CLIENTE} - ${itens[0].NM_CLIENTE}`, this.returnSizePercentW(5), this.returnSizePercentH(17));
                    pdf.fontSize(10).text(`FUNCIONARIO: ${funcionario.toUpperCase()}`, this.returnSizePercentW(5), this.returnSizePercentH(18.5));
                    hInicial = 28
                }
            });
            const qtde = itens.reduce((acc: number, cur) => acc + cur.QTDE,0);
            pdf.fontSize(10).text(`TOTAL DE PEÇAS: ${qtde}`, this.returnSizePercentW(5), this.returnSizePercentH(hInicial));

            pdf.fontSize(12).text('Assinatura,', this.returnSizePercentW(5), this.returnSizePercentH(hInicial + 6));

            pdf.moveTo(this.returnSizePercentW(15), this.returnSizePercentH(hInicial + 7))
                .lineTo(this.returnSizePercentW(50), this.returnSizePercentH(hInicial + 7)).dash(5, { space: 5 }).stroke();

            pdf.fontSize(12).text('Data:____/____/____', this.returnSizePercentW(70), this.returnSizePercentH(hInicial + 6));
            pdf.end();
            writeStream.on('finish', () => { res(path.replace('C:/inetpub/wwwroot','http://192.168.1.159')); })
            
        })
        return promise
    }


    public gerarRelatorio(req: Request, res: Response) {
        let itens: Array<Itens>;
        itens = req.body.itens;
        let dados: {tipo: string, ID: number, descricao: string };
        dados = req.body.dados;
        console.log(itens);
        const path = `${this.dirNameArquivos}/${dados.tipo === 'Venda' ? dados.ID : dados.descricao.replace(' ','_')}`;
        existsSync(path) || mkdirSync(path);
        this.gerarPdf(`${path}/${moment().format('DD-MM-YYYY-hh-mm')}.pdf`, itens, res.locals.nome, dados)
        .then(response => {
            res.json({status: true, path: response})
        }).catch(err => {
            res.json({status: false, path: ''})
        })        
    }
    
    
    public uploadFile(req: Request, res: Response) {    
        var form = new IncomingForm();
        form.on('fileBegin', function (name, file){
            const dirNameArquivos: string = "C:/inetpub/wwwroot/arquivos/itens";
            file.path = `${dirNameArquivos}/${req.params.ID_CLIENTE}`;                    
            existsSync(file.path) || mkdirSync(file.path);     
            file.name = `${req.params.ID_ITEM_VENDIDO}.${file.type.replace('image/','')}`;
            file.path = `${file.path}/${file.name}`;
        });
        form.on('file', (field, file) => {     
            console.log('Uploaded ' + file.name);       
            const query = `UPDATE DV_ITENS_VENDIDOS SET ARQUIVO_DESENHO = '${file.name}' WHERE ID_ITEM_VENDIDO = ${req.params.ID_ITEM_VENDIDO}`;
            this.daoCtrl.queryDB<any>(query, (err, result) => {
                if (err) {
                    console.dir({
                        error: err,
                        query: query
                    })      
                    return;
                }
                if (result){                
                    console.log(result);
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
        }) 
        form.parse(req)           
    }

}