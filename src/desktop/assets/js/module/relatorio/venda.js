/**
 * Relatório de Vendas
 * 
 */

var {dialog} = require('electron').remote;

APP_PAGE = {

    config: {
        title: 'Relatório de Vendas',
        report: SERVER_URL + '/cadastro/venda/report'
    },

    dataTable: [],
    modal: null,

    // Start this page
    start: function() {

        $("title").html(APP_PAGE.config.title)
        $("#toptitle").html(APP_PAGE.config.title)

        // Pegando a listagem de veículos
        APP_BASE.getVeiculos(true);
    },

    // Message from modal (by IPC)
    modalMsg: function(e, a, b ,c){
       
       //alert('Excel --- chegou!');
       //console.log('Excel --- chegou! -- ', a, b, c);

       if(b == 'print') return APP_PAGE.print();
       if(b == 'excel') return APP_PAGE.exportToExcel();

       APP_PAGE.modal.close();
    },

    // Abre as configurações para imprimir
    print: function(){
        APP_PAGE.modal.print();
    },


    // Exporta os dados para Excel
    exportToExcel: function(){

        // Fechando a janela modal
        APP_PAGE.modal.close();

        var Excel = require('exceljs');
        // A new Excel Work Book
        var workbook = new Excel.Workbook();

        // Some information about the Excel Work Book.
        workbook.creator = 'W5 Frota - Gerenciador de Frota';
        workbook.lastModifiedBy = '';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();

        // Create a sheet
        var sheet = workbook.addWorksheet('Sheet1');

        var tmp = [];
        var c = 0;
        for (var x in APP_PAGE.dataTable.title){
            tmp[c] = { header: APP_PAGE.dataTable.title[x].title, key: x };
            c++;
        }

        sheet.columns = tmp;

        // Adicionando as linhas
        for (var i in APP_PAGE.dataTable.row) {

            var linha = {};
            for (var x in APP_PAGE.dataTable.title) {
                linha[x] = APP_PAGE.dataTable.row[i][x].title;
            }

            sheet.addRow(linha);
        }

        dialog.showSaveDialog({
            properties: ['openFile'],
            filters: [{name: 'Excel', extensions: ['xlsx', 'xls']}]
            }, function(file){

            // Apaga o arquivo temporário se o usuário cancelar
            if(file == "undefined") { return false }

            // Save Excel on Hard Disk
            workbook.xlsx.writeFile(file).then(function() {
                report('Arquivo "'+file+'" salvo.', INFO);
            });
        })

    },
     
    // Busca o relatório no servidor
    generate: function(){

        var data = {
            veiculo: $("#veiculo").val(),
            inicio:  $("#inicio").val(),
            fim:     $("#fim").val()
        }

        //Validações
        if (data.inicio.trim() == '') {
            $("#inicio").focus();
            return report('Indique a <b>Data de Início</b>!', ALERT);
        }

        if (data.fim.trim() == '') {
            $("#fim").focus();
            return report('Indique a <b>Data final</b>!', ALERT);
        }

        // Enviando solicitação
        SERVER.send(APP_PAGE.config.report, data, function(data) { 

            if(data.error == true){
                APP_PAGE.dataTable;
                return report('Nenhum resultado encontrado!');
            }

            // Guardando os dados recebidos...
            APP_PAGE.dataTable = data;

            // Gerando tabela de visualização.
            APP_PAGE.showList();
        })
    },

    // Monta o display de listagem dos registros
    showList: function() {

        // Pegando os dados recebidos
        var data = APP_PAGE.dataTable;

        if (data.row.length == 0) {
            return $("#report").html('Nenhum resultado encontrado!');
        }

        // Montando a tabela de exibição e o seletor de "Order by"
        var table = '<table class="ui striped celled very compact table"><thead><tr>';

        for (var x in data.title) {
             table += '<th'+("undefined" != typeof data.title[x]['extra'] ? ' ' + data.title[x].extra :'')+'>' + data.title[x].title + '</th>';
        }
        table += '</tr></thead><tbody>';

        for (var i in data.row) {

            table += '<tr>';
            for (var x in data.title) {
                if("undefined" == typeof data.row[i][x]) {
                    continue
                }
                table += '<td'+("undefined" != typeof data.row[i][x]['extra'] ? ' ' + data.row[i][x].extra :'')+'>' + data.row[i][x].title + '</td>';
            }
        }

        table += '</tbody>';

        if("undefined" != typeof data['foot']){
            table += '<tfoot>';
            for (var x in data.foot) {
                table += '<th'+("undefined" != typeof data.foot[x]['extra'] ? ' ' + data.foot[x].extra :'')+'>' + data.foot[x].title + '</th>';
            }
            table += '</tr></tfoot>';
        }

        table += '</table>';
        

        // ...and SHOW!
        APP_PAGE.showModal(table);

    },


    // Abre a janela "MODAL" e enfia os dados...
    showModal: function(table){

        var table = table || false;
        if(!table) return false;
        
        // Abrindo a janela modal
        APP_PAGE.modal = window.open('', 'Frota :: Visualização de Impressão');

        var body = '<!doctype html><html lang="pt-br"><head><meta charset="utf-8"><meta name="description" content=""><meta name="viewport" content="width=device-width, initial-scale=1"><title></title><link rel="stylesheet" type="text/css" href="css/print.css"></head><body>'
            +'<div class="reportHeader">'+$("#reportHeader").html()+'</div>'
            +'<div class="reportControl">'+$("#reportControlA").html()+'</div>'
            +table
            +'<div class="reportControl">'+$("#reportControlB").html()+'</div>'
            +'<script>const{ipcRenderer}=require("electron");function message(msg){ipcRenderer.send("appCommandPage",msg)}</script></body></html>';

        //copiando para a área de impressão
        APP_PAGE.modal.document.write(body)
    }
}

// RUNNING ...
$(document).ready(function(){APP_PAGE.start()})