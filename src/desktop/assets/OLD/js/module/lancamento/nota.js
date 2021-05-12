/**
 * Cadastro da Empresa e suas filiais
 * 
 */
APP_PAGE = {

    config: {
        title: 'Nota',
        tipo_nota: 0,
        tipo: '',
        origem: '',
        tipoList: [],

        list: SERVER_URL + '/cadastro/nota/search/',
        find: SERVER_URL + '/cadastro/nota/find/',
        save: SERVER_URL + '/cadastro/nota/save/',
        delete: SERVER_URL + '/cadastro/nota/delete/',
        undelete: SERVER_URL + '/cadastro/nota/undelete/',

        tipoNotas: SERVER_URL + '/cadastro/tipo_nota/list/',

        infracao: {
            list: SERVER_URL + '/cadastro/nota/list_infracao/',
            itens: [],
            total: 0
        }
    },

    status: 'list',

    // Start this page
    start: () =>  {

        $("title").html(APP_PAGE.config.title)
        $("#toptitle").html(APP_PAGE.config.title)

        // coloca a opção em FALSE, ao iniciar
        document.getElementById('buscar_lixeira').checked = false

        // Capturando referência aos campos de exibição do form
        APP_LANCAMENTO.listField = document.getElementById('list')
        APP_LANCAMENTO.editField = document.getElementById('edit')

        // Escutando o input FILE
        $('#file').on('change', (e) => {SENDFILE.add(e)})

        // Listagem de dados
        APP_PAGE.list()

        // Escutando a caixa de pesquiza
        document.getElementById('buscar').onkeyup = APP_PAGE.search

        // Mostrando a listagem ao clicar no campo
        $("#list").on('click', (e) =>  {

            if (e.target.id != 'list') return false

            // Barra de Título
            $("title").html(APP_PAGE.config.title + ' / Listagem')
            $("#toptitle").html(APP_PAGE.config.title + ' / Listagem')

            // Visualização
            APP_PAGE.display('list')
        })

        // Ativando a barra de ferramentas do cadastro
        $(".topbar").show()

        // Restart semantic-ui resourses
        $('.ui.checkbox').checkbox()

        //APP_PAGE.getTipoNotas(true)
        APP_BASE.getVeiculos(true)
        APP_BASE.getClientes(true)
        APP_BASE.getFornecedores(true)

        // Escutando a mudança de Tipo de Nota
        $("#tipo_nota").on('change', (e) => APP_PAGE.changeTipo(e))

        // Escutando a mudança de empresa
        $('#cliente').on('change', (e) => APP_PAGE.selEmpresa(e))  
    },

    // Mostra a listagem ou o formulário de edição
    display: (d) => {
        if(d == 'list') {
            APP_LANCAMENTO.editField.classList.remove('open')
            APP_LANCAMENTO.listField.classList.add('open')
            APP_LANCAMENTO.listField.scroll(0,0)
        } else {
            APP_LANCAMENTO.editField.classList.add('open')
            APP_LANCAMENTO.listField.classList.remove('open')
            APP_LANCAMENTO.editField.scroll(0,0)
        }
    },

    // Caixa de pesquiza
    search: (e) =>  {
        TMP3 = e
        if (e.which == 13) {
            var trash = document.getElementById('buscar_lixeira').checked
            APP_PAGE.list(e.target.value, 1, $("#buscar_rpp").val(), $("#buscar_order").val(), trash)

            // sinalizando a busca
            e.target.parentNode.classList.add('loading')
            setTimeout(() =>  {
                document.getElementById('buscar').parentNode.classList.remove('loading')
            }, 500)
        }
    },

    // Search button
    goSearch: (page) => {
        var trash = document.getElementById('buscar_lixeira').checked
        var page = page || 1
        APP_PAGE.list($("#buscar").val(), page, $("#buscar_rpp").val(), $("#buscar_order").val(), trash)
    },

    // Carrega listagem de dados
    list: (query, page, rpp, order, trash) => {
        var page = page || 1
        var rpp = rpp || 10
        var query = query || ''
        var order = order || ''
        var trash = trash || false

        APP_PAGE.status = 'list'

        APP_LANCAMENTO.list_page_atual = page

        // Barra de Título
        $("title").html(APP_PAGE.config.title + ' / Listagem')
        $("#toptitle").html(APP_PAGE.config.title + ' / Listagem')

        // Enviando solicitação
        SERVER.send(APP_PAGE.config.list, {
            r: rpp,
            p: page,
            q: query,
            o: order,
            t: trash,
            tipo: APP_PAGE.config.tipo
        }, (data) => APP_PAGE.showList(data, query))
    },

    // Monta o display de listagem dos registros
    showList: (data, query) => { 

        if (data.page.total == 0) {
            // Visualização
            APP_PAGE.display('list')
            return APP_LANCAMENTO.listField.innerHTML = 'Nenhum resultado encontrado!'
        }

        // Montando a tabela de exibição e o seletor de "Order by"
        var table = '<table class="ui striped very compact table"><thead><tr>'
        var op = ''
        for (var x in data.title) {
            if (x == 'id') continue
            op += '<option value="' + x + '">' + data.title[x].value + '</option>'
            table += '<th'+APP_PAGE.extraAttr(data.title[x])+'>' + data.title[x].value + '</th>'
        }
        table += '<th></th></tr></thead><tbody>'
        $("#buscar_order").html(op)

        for (var i in data.row) {
            if (i == 'title') {
                continue
            }

            var title = data.row[i].status.value == "Aberto" ? 'Click para Visualizar e FECHAR a nota' : 'Click para Visualizar'

            table += '<tr class="table-edit">'
            for (var x in data.row[i]) {
                if (x == 'id' || x == 'deleted') continue
                table += '<td title="'+title+'" onclick="APP_PAGE.edit(\'' + data.row[i].id + '\')"'+APP_PAGE.extraAttr(data.row[i][x])+'>' + data.row[i][x].value + '</td>'
            }

            if (data.row[i]['deleted'] == false) {
                table += '<td width="44px"><button class="ui mini icon button basic" onclick="APP_PAGE.delete(\'' + data.row[i].id + '\')" data-tooltip="Apagar" data-inverted="" data-position="left center"><i class="trash alternate outline icon"></i></button></td></tr>'
            } else {
                table += '<td width="44px"><button class="ui mini icon button basic" onclick="APP_PAGE.undelete(\'' + data.row[i].id + '\')" data-tooltip="Retirar da lixeira" data-inverted="" data-position="left center"><i class="undo icon"></i></button></td></tr>'
            }
        }

        table += '</tbody></table><div>Exibindo ' + data.row.length + ' de ' + data.page.total + ' registro' + (data.page.total > 1 ? 's' : '') + '.</div>'

        // Mostrar botões de paginação
        if (data.page.pages > 1) {
            table += '<div class="ui small right floated pagination menu">'

            for (var i = 1; i <= data.page.pages; i++) {

                if (i == 1 || i == data.page.pages || (i > (parseInt(data.page.page) - 5) && i < (parseInt(data.page.page) + 5))) {
                    table += '<a class="item' + (data.page.page == i ? ' active' : '') + '" onclick="APP_PAGE.list(\'' + query + '\', ' + i + ', ' + data.page.rpp + ',\'' + data.page.order + '\', ' + data.page.trash + ')">' + i + '</a>'
                } else if (i == (parseInt(data.page.page) - 5) || i == (parseInt(data.page.page) + 5)) {
                    table += '<a class="item disabled">...</a>'
                } else {
                    continue
                }
            }
            table += '</div>'
        }

        APP_LANCAMENTO.listField.innerHTML = table

        // Visualização
        APP_PAGE.display('list')
    },

    //Função para capturar atributos extras nos campos
    extraAttr: (a) => {
        if(a.length <= 1) return ''        

        attr = ''
        for(var i in a){
            if(i == 'value') continue
            attr += ' '+i+'="'+a[i]+'"'
        }

        return attr
    },

    //Edição || Visualização dos dados --> para EMPRESA : TODO criar um sistema para todos os outros
    edit: (id) => {

        APP_PAGE.status = 'edit'

        SERVER.send(APP_PAGE.config.find, {
            id: id
        }, (data) => { console.log('[EDIT]', data)
            if ("undefined" == typeof data['nota']) {
                return report('Nenhum resultado encontrado!', ALERT)
            }

            // Limpando lista de arquivo
            SENDFILE.clear()

            // Pegando lista de arquivos anexados
            SENDFILE.list('nota', id, false)

            // Proibindo anexar arquivos
            SENDFILE.noAdd = true
            document.getElementById("file").type = 'hidden'
            $("#fileBtn").hide()
            

            // Configurando o tipo de nota
            APP_PAGE.config.tipo_nota = data.nota.tipo_nota
            APP_PAGE.config.tipo = data.nota.tipo
            APP_PAGE.config.origem = data.nota.origem
            APP_PAGE.refleshDisplay()

            // Inserindo os dados no formulário
            $('#id').val(data.nota.id)
            $('#tipo_nota').html('<option value="0">'+data.nota.tipo_nome+' | '+data.nota.origemText+'</option>')
            $('#veiculo').html('<option value="0">'+data.nota.veiculo+'</option>')
            $('#cliente').html('<option value="0">'+data.nota.cliente+'</option>')
            $('#fornecedor').html('<option value="0">'+data.nota.fornecedor+'</option>')
            $('#numero').val(data.nota.numero).attr('readonly', true)
            $('#vencimento').val(data.nota.vencimento).attr('readonly', true)
            $('#pagamento').val(data.nota.pagamento)
            if(data.nota.status == "F"){
                $('#pagamento').attr('readonly', true)
                $("#salvarBtn").hide()
            } else {
                $('#pagamento').attr('readonly', false)
                $("#salvarBtn").show()
            }
            $('#status').val(data.nota.status)
            $('#total').val(floatToReal(data.nota.total)).attr('readonly', true)
            $('#obs').val(data.nota.obs).attr('readonly', true)

            // Barra de Título
            $("title").html(APP_PAGE.config.title + ' / Edição')
            $("#toptitle").html(APP_PAGE.config.title + ' / Edição')

            // Visualização
            APP_PAGE.display('edit')
            $("#listagem").html('')

            // Pegando a listagem de ítens (infração)
            if(APP_PAGE.config.origem == "I"){
                APP_PAGE.config.infracao.itens = []
                if("undefined" != typeof data['row']){
                    APP_PAGE.itemList(data)
                }
            }            
        })
    },

    // Add --> para EMPRESA : TODO criar um sistema para todos os outros
    add: () =>  {

        APP_PAGE.status = 'add'

        // Limpando lista de arquivo
        document.getElementById("file").type = 'file'
        $("#fileBtn").show()
        SENDFILE.clear()


        // Carregando os dados dos DROPDRAWs
        APP_PAGE.getTipoNotas(true)
        APP_BASE.getVeiculos(true)
        APP_BASE.getClientes(true)
        APP_BASE.getFornecedores(true)

        // Limpando o tipo de nota
        APP_PAGE.config.tipo_nota = 0
        APP_PAGE.config.tipo = ''
        APP_PAGE.config.infracao.itens = []
        APP_PAGE.refleshDisplay()

        $('#id').val(0)
        APP_PAGE.mountTipoSelector(APP_PAGE.config.tipoList, true)
        $('#veiculo').dropdown('set selected','0')
        $('#cliente').dropdown('set selected','0')
        $('#fornecedor').dropdown('set selected','0')
        $('#numero').val('').attr('readonly', false)
        $('#vencimento').val('').attr('readonly', false)
        $('#pagamento').val('').attr('readonly', false)
        $('#status').val('A')
        $('#total').val('').attr('readonly', false)
        $('#obs').val('').attr('readonly', false)

        // Habilitando o salvamento do form
        $("#salvarBtn").show()
        $("#listagem").html('')

        // Barra de Título
        $("title").html(APP_PAGE.config.title + ' / Novo')
        $("#toptitle").html(APP_PAGE.config.title + ' / Novo')

        // Visualização
        APP_PAGE.display('edit')
    },

    // SAVE
    save: () =>  {

        // Para fechamento da NOTA (editar)
        if (APP_PAGE.status == 'edit') {
            if ($('#pagamento').val().trim() == "" ) {
                return report('Indique a data de <b>Pagamento</b>, para FECHAR a nota.<br/>Caso não queira fazer o fechamento agora, clique no botão "CANCELAR".', ALERT, null, 9000)
            } else {
                // Enviando
                SERVER.send(APP_PAGE.config.save, 
                    {
                        type: 'close', 
                        pagamento: $('#pagamento').val().trim(),
                        id: $('#id').val()
                    },
                    (data) => {

                    if ("undefined" == typeof data['msg']) {
                        return report('Não consegui <b>fechar</b> a nota.', ALERT)
                    }

                    report(data.msg, INFO)
                    return APP_PAGE.goSearch()
                })
                return
            }
        }

        // Carregando os dados        
        var data = {
            type: 'create',
            id: $('#id').val(),
            tipo_nota: $('#tipo_nota').val(),
            origem: APP_PAGE.config.origem,
            numero: $('#numero').val(),
            vencimento: $('#vencimento').val(),
            pagamento: $('#pagamento').val(),
            status: $('#status').val(),
            obs: $('#obs').val(),
            detalhe: APP_PAGE.getDetalhes()
        }

        //Status... (pago => fechada)
        if(data.pagamento != ''){
            data.status = 'F'
        }
       
        // Validações
        if(data.detalhe.length == 0){
            var item = ''
            switch(APP_PAGE.config.origem){
                case "I":
                    item = 'registro de infração'
                    break
                case "C":
                case "O":
                case "V":
                case "G":
                    item = 'Ítem'
                    break
            }
            return report('É preciso ter, pelo menos, um <b>'+item+'</b> selecionado!', ALERT)            
        }
        if (data.tipo_nota == 0) {
            $("#tipo_nota").focus()
            return report('É preciso selecionar o TIPO de NOTA!', ALERT)
        }
        if (APP_PAGE.config.tipo == 'P' && data.detalhe[0].fornecedor == "0") {
            $("#fornecedor").focus()
            return report('Selecione o FORNECEDOR!', ALERT)
        }
        if (APP_PAGE.config.tipo == 'R' && data.detalhe[0].cliente == "0") {
            $("#cliente").focus()
            return report('Selecione o CLIENTE!', ALERT)
        }
        if (data.numero == 0) {
            $("#numero").focus()
            return report('Qual é o NÚMERO dessa nota?', ALERT)
        }
        if (data.vencimento == 0) {
            $("#vencimento").focus()
            return report('Qual é a data de VENCIMENTO da nota?', ALERT)
        }
        if (APP_PAGE.config.origem != "I" && realToFloat($("#total").val()) == 0) {
            $("#total").focus()
            return report('Qual é o valor TOTAL desta nota?', ALERT)
        }
        // if (APP_PAGE.config.tipo_nota == 3 && data.detalhe[0].ref == 0) {
        //     $("#total").focus()
        //     return report('É preciso adicionar, pelo menos, uma (1) OS!!', ALERT)
        // }


        // Enviando
        SERVER.send(APP_PAGE.config.save, data, (data) => { console.log(data)

            if ("undefined" == typeof data['msg']) {
                return report('Não consegui salvar o registro!', ALERT)
            }

            // Enviando arquivos anexados
            SENDFILE.save('nota', data.id)

            report(data.msg, INFO)
            return APP_PAGE.goSearch()
        })
    },

    // Botão de cancelar (fechar) o formulário de edição
    cancel: () =>  {
        // Barra de Título
        $("title").html(APP_PAGE.config.title + ' / Listagem')
        $("#toptitle").html(APP_PAGE.config.title + ' / Listagem')

        APP_PAGE.display('list')
    },

    // DELETE --> para EMPRESA : TODO criar um sistema para todos os outros
    delete: (id) => {
        SERVER.send(APP_PAGE.config.delete, {
            id: id
        }, (data) => {
            if ("undefined" == typeof data['msg']) {
                return report('Não consegui apagar o registro!', ALERT)
            }

            report(data.msg, INFO)
            return APP_PAGE.goSearch(APP_LANCAMENTO.list_page_atual)
        })
    },

    // Restaurar um ítem apagado
    undelete: (id) => {
        SERVER.send(APP_PAGE.config.undelete, {
            id: id
        }, (data) => {
            if ("undefined" == typeof data['msg']) {
                return report('Não consegui apagar o registro!', ALERT)
            }

            report(data.msg, INFO)
            return APP_PAGE.goSearch(APP_LANCAMENTO.list_page_atual)
        })
    },

    // Monta o array de detalhes
    getDetalhes: () => {
        var detalhe = []
        
        if(APP_PAGE.config.origem == "I"){ // Para INFRAÇÃO
            
            APP_PAGE.config.infracao.itens.map((a, id) => {
                if(a.active) {
                    detalhe.push({
                        ref: id,
                        veiculo: a.veiculo,
                        cliente: $('#cliente').val(),
                        fornecedor: $('#fornecedor').val(),
                        valor: a.value
                    })
                }
            })
        } else {
            var detalhe = [{
                ref: 0,
                veiculo: $('#veiculo').val(),
                cliente: $('#cliente').val(),
                fornecedor: $('#fornecedor').val(),
                valor: realToFloat($('#total').val())
            }]
        }

        console.log('<<DETALHES>>', detalhe)

        // TODO: acrescentar listagem de detalhes da OS
        return detalhe
    },

    // Quando o usuário trocar o tipo de nota...
    changeTipo: (e) =>  {

        APP_PAGE.config.tipo_nota = parseInt(e.target.value)
        if(APP_PAGE.config.tipo_nota != 0){
            APP_PAGE.config.tipo = APP_PAGE.config.tipoList[APP_PAGE.config.tipo_nota].tipo_nota
            APP_PAGE.config.origem = APP_PAGE.config.tipoList[APP_PAGE.config.tipo_nota].origem
        } else {
            APP_PAGE.config.tipo = ''
            APP_PAGE.config.origem = ''
        }
        APP_PAGE.refleshDisplay()
    },

    // Quando o usuário trocar o tipo de nota...
    changeArea: (e) =>  {
        APP_PAGE.refleshDisplay()
    },

    // Formatando a visualização
    refleshDisplay: () => {

        // Limpa os campos do formulário
        var fields = () => {
            $("#veiculo").dropdown('set selected','0')
            $("#cliente").dropdown('set selected','0')
            $("#fornecedor").dropdown('set selected','0')
            $("#numero").val('')
            $("#vencimento").val('')
            $("#pagamento").val('')
            $("#total").val('')
            $("#obs").val('')
        }

        $("#veiculo_field").hide()
        $("#cliente_field").hide()                
        $("#fornecedor_field").hide()
        $("#formInfracao").hide()

        console.log('[refleshDisplay]', APP_PAGE.config)

        // Nota de [P]agamento ou [R]ecebimento
        if(APP_PAGE.config.tipo == 'P'){
            $("#fornecedor_field").fadeIn('slow').show()
        } else if(APP_PAGE.config.tipo == 'R'){
            $("#cliente_field").fadeIn('slow').show()
        }
        
        // Resetando os campos ...
        fields()

        // Se não houver um tipo de nota selecionado, reseta.
        if (APP_PAGE.config.tipo_nota == '') {            
            $("#formulario").fadeOut('slow').hide()
        } else {
            $("#formulario").fadeIn('slow')
        }
    },

    // Pegando a listagem de tipoNotas
    getTipoNotas: () => {        

        SERVER.send(APP_PAGE.config.tipoNotas, {}, (data) => {

            APP_PAGE.config.tipoList = [] // Zerando a listagem
            if("undefined" == typeof data['row']) return false // Se vier sem rows (nenhum resultado)            

            APP_PAGE.mountTipoSelector(data.row, true)

            data.row.map((a) => { // Carregando a listagem com dados
                APP_PAGE.config.tipoList[a.id] = {id: a.id, tipo_nota: a.tipo_nota, nome: a.nome, origem: a.origem, origemText: a.origemText}
            })
        })
    },

    // Monta o Select de tipo de notas
    mountTipoSelector: (data, unSelected) => {
        var unSelected = unSelected || false
        var op = ''
        data.map((a, i)=> {
            op += '<option value="'+a.id+'">'+a.nome+' | '+a.origemText+'</option>'
        })

        if(unSelected) { op = '<option value="0" selected>Selecione...</option>'+op }
        $("#tipo_nota").html(op)
    },    
    
    // Mudança de estado do combo CLIENTE
    selEmpresa: (e) => {
        // Limpando a listagem
        $("#listagem").html('')

        if(e.target.value != "0" && e.target.value != ""){

            if(APP_PAGE.config.origem == 'I' && APP_PAGE.status == 'add'){
                APP_PAGE.getInfracao(e.target.value)
            }
        }
    },
    
    

    //    ------------------------------ INFRAÇÃO -------------------------------------------------
    
    

    // Pegando a listagem de Tipo de Infração
    getInfracao: (empresa) => {
        $("#listagem").html('')
        APP_PAGE.config.infracao.itens = []
        SERVER.send(APP_PAGE.config.infracao.list, {empresa: empresa}, (data) => {
            
            if("undefined" != typeof data['row']){
                APP_PAGE.itemList(data)
            } else {
                $("#listagem").html('<div class="ui yellow message">Nenhum ítem encontrado para essa <b>empresa</b>.</div>')
            }           
        })
    },

    // Gerando a listagem 
    itemList: (data) => { console.log('< entrou em itemList>', data)
        var table = '<h3>Detalhamento</h3><table class="ui striped very compact table"><thead><tr>'
        var op = ''
        for (var x in data.title) {
            if (x == 'id') continue
            table += '<th'+((x == 'valor' || x == 'data') ? ' style="text-align:center"' : '')+'>' + data.title[x] + '</th>'
        }
        table += '<th></th></tr></thead><tbody>'

        for (var i in data.row) {

            // Salvando os valores
            APP_PAGE.config.infracao.itens[parseInt(data.row[i].id)] = {
                active: true, 
                veiculo: data.row[i].idveiculo, 
                value: realToFloat(data.row[i].valor
            )}

            table += '<tr class="listitem" data-index="'+data.row[i].id+'" data-active="true">'
            for (var x in data.row[i]) {
                if (x == 'id') continue
                if (x == 'deleted') continue
                if (x == 'idveiculo') continue

                var align = ''
                if(x == 'valor') align = ' style="text-align:right"' + (APP_PAGE.status == 'edit' ? ' colspan="2"': '')
                if(x == 'data') align = ' style="text-align:center"'

                table += '<td'+align+'>' + data.row[i][x] + '</td>'
            }

            if(APP_PAGE.status == 'add'){
                table += '<td width="10"><button type="button" class="ui mini icon button basic" onclick="APP_PAGE.select(\'' + data.row[i].id + '\')" data-tooltip="Não incluir" data-inverted="" data-position="left center"><i class="close icon"></i></button></td></tr>'
            }
        }

        table += '</tbody></table>'

        $("#listagem").html(table)
        APP_PAGE.infracaoTotal()
    },

    // Soma os valores das infrações gravados na configuração e mostra no formulário
    infracaoTotal: () => {
        var total = 0
        APP_PAGE.config.infracao.itens.map((a) => {
            if(a.active) {
                total += a.value
            }
        })
        console.log('[infracaoTotal]', total)
        $("#total").val(floatToReal(total))
        APP_PAGE.config.infracao.total = total
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

                    // Ajustando o total
                    APP_PAGE.config.infracao.itens[parseInt(id)].active = false
                    APP_PAGE.infracaoTotal()
                } else {
                    h[i].classList.remove('off')
                    h[i].setAttribute('data-active', "true")                    
                    b.setAttribute('data-tooltip', 'Não incluir')
                    ic.classList.remove('plus')
                    ic.classList.add('close')

                    // Ajustando o total
                    APP_PAGE.config.infracao.itens[parseInt(id)].active = true
                    APP_PAGE.infracaoTotal()
                }
            }
        } 

         console.log(APP_PAGE.config.infracao)
    }
}

// RUNNING ...
$(document).ready(() => APP_PAGE.start())