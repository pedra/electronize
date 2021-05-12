/**
 * Notificação de Infração
 * 
 */
APP_PAGE = {

    config: {
        title: APP_NOTIFICACAO.page.title + ' / Infração',

        list: SERVER_URL + '/notificacao/infracao/list/',
        save: SERVER_URL + '/notificacao/infracao/save/'
    },

    // Start this page
    start: () => {

        $("title").html(APP_PAGE.config.title)
        $("#toptitle").html(APP_PAGE.config.title);

        // Capturando referência aos campos de exibição do form
        APP_NOTIFICACAO.listField = document.getElementById('list')
        APP_NOTIFICACAO.editField = document.getElementById('edit')
        APP_NOTIFICACAO.editField.classList.add('open')
        APP_NOTIFICACAO.listField.classList.remove('open')
        APP_NOTIFICACAO.editField.scroll(0,0);
        
        // Escutando o input FILE
        $('#file').on('change', (e) => SENDFILE.add(e));

        // Escutando a mudança de empresa
        $('#cliente').on('change', (e) => APP_PAGE.selEmpresa(e));

        // desativando a barra de ferramentas do notificacao
        $(".topbar").hide();

        // Carregando lista de Clientes
        APP_BASE.getClientes(true);
    },

    // SAVE --> para EMPRESA : TODO criar um sistema para todos os outros
    save: () => {

        var data = {
            from: [],
            destinatario: [],
            titulo: $("#titulo").val().trim(),
            mensagem: $("#mensagem").val().trim(),
            item: []
        }

        //Pegando os EMAILS de ENVIO
        var e = document.getElementById('from')
        var o = e.selectedOptions
        for(var i in o){
            if("undefined" != typeof o[i]['text']) { 
                data.from.push({
                    id: o[i].value,
                    text: o[i].text
                })
            }
        }

        //Pegando os EMAILS dos destinatários
        var e = document.getElementById('destinatario')
        var o = e.selectedOptions
        for(var i in o){
            if("undefined" != typeof o[i]['text']) { 
                data.destinatario.push({
                    id: o[i].value,
                    text: o[i].text
                })
            }
        }

        // Varrendo e pegando os ítens selecionados
        var h = document.querySelectorAll(".listitem")
        for(var i in h){
            if("undefined" != typeof h[i]['getAttribute']
                && h[i].getAttribute('data-active') == "true"){
                data.item.push(h[i].getAttribute('data-index'))                
            } 
        }

        // Validações
        if (data.titulo == "") {
            $("#titulo").focus()
            return report('É obrigatório escrever um <b>Título</b>', WARN)
        }

        if (data.mensagem == "") {
            $("#mensagem").focus()
            return report('É obrigatório escrever uma <b>Mensagem</b> para o corpo do e-mail', WARN)
        }

        if (data.from.length == 0) {
            $("#from").focus()
            return report('É obrigatório indicar a <b>Conta de envio</b>', WARN)
        }

        if (data.destinatario.length == 0) {
            $("#destinatario").focus()
            return report('É obrigatório indicar um <b>Destinatário</b>, pelo menos', WARN)
        }

        if (data.item.length == 0) {
            $("#cliente").focus()
            return report('É obrigatório habilitar, pelo menos, uma <b>Infração</b>', WARN)
        }

        // Enviando
        SERVER.send(APP_PAGE.config.save, data, (data) => {

            if ("undefined" == typeof data['msg']) {
                return report('Não consegui enviar a notificação!', ALERT)
            }

            APP_PAGE.cancel()
            report(data.msg, INFO)
        })
    },

    // Botão de cancelar (limpar) o formulário
    cancel: () => {
        $("#listagem").html('')
        $("#destinatario").html('')
        $("#cliente").dropdown('clear')
    },

    // Pegando a listagem de Tipo de Infração
    getInfracao: (empresa) => {
        $("#listagem").html('');
        SERVER.send(APP_PAGE.config.list, {empresa: empresa}, (data) => {
            
            if("undefined" != typeof data['row']){
                APP_PAGE.itemList(data)
                if("undefined" != typeof data['destinatario']) {
                    APP_PAGE.emailList(data.destinatario, "destinatario")
                }
                if("undefined" != typeof data['from']) {
                    APP_PAGE.emailList(data.from, "from")
                }
            } else {
                $("#formulario").hide()
                $("#listagem").html('<div class="ui yellow message">Nenhum ítem encontrado para essa <b>empresa</b>.</div>')
                $("#destinatario").dropdown('clear')
            }           
        })
    },

    // Gerando a listagem 
    itemList: (data) => {
        var table = '<table class="ui striped very compact table"><thead><tr>';
        var op = '';
        for (var x in data.title) {
            if (x == 'id') continue;
            table += '<th'+((x == 'valor' || x == 'data') ? ' style="text-align:center"' : '')+'>' + data.title[x] + '</th>';
        }
        table += '<th></th></tr></thead><tbody>';

        for (var i in data.row) {
            if (i == 'title') {
                continue
            }

            table += '<tr class="listitem" data-index="'+data.row[i].id+'" data-active="true">';
            for (var x in data.row[i]) {
                if (x == 'id') continue
                if (x == 'deleted') continue
                if (x == 'idveiculo') continue

                var align = '';

                if(x == 'valor') align = ' style="text-align:right"';
                if(x == 'data') align = ' style="text-align:center"';

                table += '<td'+align+'>' + data.row[i][x] + '</td>';
            }
            table += '<td width="10"><button type="button" class="ui mini icon button basic" onclick="APP_PAGE.select(\'' + data.row[i].id + '\')" data-tooltip="Não incluir" data-inverted="" data-position="left center"><i class="close icon"></i></button></td></tr>';
        }

        table += '</tbody></table>';

        $("#listagem").html(table);
        $("#formulario").fadeIn('slow')
    },

    // Listagem de e-mails
    emailList: (email, elemento) => {
        var op = email.map((a) => '<option value="'+a.id+'">'+a.email+'</option>')
        $("#"+elemento).html(op);
    },

    // Habilita/desabilita o ítem da listagem
    select: (id) => {
        var h = document.querySelectorAll(".listitem")
        for(var i in h){
            if("undefined" != typeof h[i]['getAttribute'] 
                && h[i].getAttribute('data-index') == id){
                var b = h[i].querySelector('button')
                var ic = b.querySelector('i')

                if(h[i].getAttribute('data-active') == "true"){
                    h[i].classList.add('off')
                    h[i].setAttribute('data-active', "false")
                    b.setAttribute('data-tooltip', 'Incluir')
                    ic.classList.remove('close')
                    ic.classList.add('plus')
                } else {
                    h[i].classList.remove('off')
                    h[i].setAttribute('data-active', "true")                    
                    b.setAttribute('data-tooltip', 'Não incluir')
                    ic.classList.remove('plus')
                    ic.classList.add('close')
                }
            }
        }  
    },

    selEmpresa: (e) => {
        // Limpando o formulário
        $("#listagem").html('')
        $("#destinatario").dropdown('clear')

        if(e.target.value == "0" || e.target.value == ""){
            $("#formulario").fadeOut('slow').hide()
        } else {
            APP_PAGE.getInfracao(e.target.value)            
        }
    }


}

// RUNNING ...
$(document).ready(() => APP_PAGE.start())