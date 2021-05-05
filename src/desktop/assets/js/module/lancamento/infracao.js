/**
 * Cadastro da Empresa e suas filiais
 * 
 */
var TMPX ='';
APP_PAGE = {

    config: {
        title: 'Infração',

        list: SERVER_URL + '/cadastro/infracao/search/',
        find: SERVER_URL + '/cadastro/infracao/find/',
        save: SERVER_URL + '/cadastro/infracao/save/',
        delete: SERVER_URL + '/cadastro/infracao/delete/',

        tipoinfracao: SERVER_URL + '/cadastro/tipo_infracao/list/'
    },


    // Start this page
    start: function() {

        $("title").html(APP_PAGE.config.title)
        $("#toptitle").html(APP_PAGE.config.title);

        // coloca a opção em FALSE, ao iniciar
        document.getElementById('buscar_lixeira').checked = false;

        // Capturando referência aos campos de exibição do form
        APP_LANCAMENTO.listField = document.getElementById('list')
        APP_LANCAMENTO.editField = document.getElementById('edit')

        // Escutando o input FILE
        $('#file').on('change', function(e){SENDFILE.add(e)});

        // Listagem de dados
        APP_PAGE.list();

        // Escutando a caixa de pesquiza
        document.getElementById('buscar').onkeyup = APP_PAGE.search;

        // Mostrando a listagem ao clicar no campo
        $("#list").on('click', function(e) {

            if (e.target.id != 'list') return false;

            // Barra de Título
            $("title").html(APP_PAGE.config.title + ' / Listagem')
            $("#toptitle").html(APP_PAGE.config.title + ' / Listagem')

            // Visualização
            APP_PAGE.display('list')
        })

        // Ativando a barra de ferramentas do cadastro
        $(".topbar").show();

        // Restart semantic-ui resourses
        $('.ui.checkbox').checkbox();

        // Carregando lista de Veiculos
        APP_BASE.getVeiculos();
        // Carregando lista de Clientes
        APP_BASE.getClientes();
        // Carregando lista de Tipo Infracao
        APP_PAGE.getTipoInfracao();

    },

    // Mostra a listagem ou o formulário de edição
    display: function(d) {
        if(d == 'list') {
            APP_LANCAMENTO.editField.classList.remove('open')
            APP_LANCAMENTO.listField.classList.add('open')
            APP_LANCAMENTO.listField.scroll(0,0);
        } else {
            APP_LANCAMENTO.editField.classList.add('open')
            APP_LANCAMENTO.listField.classList.remove('open')
            APP_LANCAMENTO.editField.scroll(0,0);
        }
    },

    // Caixa de pesquiza
    search: function(e) {
        TMP3 = e;
        if (e.which == 13) {
            var trash = document.getElementById('buscar_lixeira').checked;
            APP_PAGE.list(e.target.value, 1, $("#buscar_rpp").val(), $("#buscar_order").val(), trash);

            // sinalizando a busca
            e.target.parentNode.classList.add('loading');
            setTimeout(function() {
                document.getElementById('buscar').parentNode.classList.remove('loading')
            }, 500);
        }
    },

    // Search button
    goSearch: function(page) {
        var trash = document.getElementById('buscar_lixeira').checked;
        var page = page || 1;
        APP_PAGE.list($("#buscar").val(), page, $("#buscar_rpp").val(), $("#buscar_order").val(), trash);
    },

    // Carrega listagem de dados
    list: function(query, page, rpp, order, trash) {
        var page = page || 1;
        var rpp = rpp || 10;
        var query = query || '';
        var order = order || '';
        var trash = trash || false;

        APP_LANCAMENTO.list_page_atual = page;

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
        }, function(data) {
            APP_PAGE.showList(data, query);
        })
    },

    // Monta o display de listagem dos registros
    showList: function(data, query) {

        if (data.page.total == 0) {
            // Visualização
            APP_PAGE.display('list')
            return APP_LANCAMENTO.listField.innerHTML = 'Nenhum resultado encontrado!';
        }

        // Montando a tabela de exibição e o seletor de "Order by"
        var table = '<table class="ui striped very compact table"><thead><tr>';
        var op = '';
        for (var x in data.title) {
            if (x == 'id') continue;

            op += '<option value="' + x + '">' + data.title[x] + '</option>';
            table += '<th>' + data.title[x] + '</th>';
        }
        table += '<th></th></tr></thead><tbody>';
        $("#buscar_order").html(op);

        for (var i in data.row) {
            if (i == 'title') {
                continue
            }

            table += '<tr class="table-edit">';
            for (var x in data.row[i]) {
                if (x == 'id') continue;
                if (x == 'deleted') continue;
                table += '<td title="Click para editar" onclick="APP_PAGE.edit(\'' + data.row[i].id + '\')">' + data.row[i][x] + '</td>';
            }

            if (data.row[i]['deleted'] == false) {
                table += '<td width="44px"><button class="ui mini icon button basic" onclick="APP_PAGE.delete(\'' + data.row[i].id + '\')" data-tooltip="Apagar" data-inverted="" data-position="left center"><i class="trash alternate outline icon"></i></button></td></tr>';
            } else {
                table += '<td width="44px"><button class="ui mini icon button basic" onclick="APP_PAGE.undelete(\'' + data.row[i].id + '\')" data-tooltip="Retirar da lixeira" data-inverted="" data-position="left center"><i class="undo icon"></i></button></td></tr>';
            }
        }

        table += '</tbody></table><div>Exibindo ' + data.row.length + ' de ' + data.page.total + ' registro' + (data.page.total > 1 ? 's' : '') + '.</div>';

        // Mostrar botões de paginação
        if (data.page.pages > 1) {
            table += '<div class="ui small right floated pagination menu">';

            for (var i = 1; i <= data.page.pages; i++) {

                if (i == 1 || i == data.page.pages || (i > (parseInt(data.page.page) - 5) && i < (parseInt(data.page.page) + 5))) {
                    table += '<a class="item' + (data.page.page == i ? ' active' : '') + '" onclick="APP_PAGE.list(\'' + query + '\', ' + i + ', ' + data.page.rpp + ',\'' + data.page.order + '\', ' + data.page.trash + ')">' + i + '</a>';
                } else if (i == (parseInt(data.page.page) - 5) || i == (parseInt(data.page.page) + 5)) {
                    table += '<a class="item disabled">...</a>';
                } else {
                    continue;
                }
            }
            table += '</div>';
        }

        APP_LANCAMENTO.listField.innerHTML = table;

        // Visualização
        APP_PAGE.display('list')
    },

    //Edição || Visualização dos dados --> para EMPRESA : TODO criar um sistema para todos os outros
    edit: function(id) {

        SERVER.send(APP_PAGE.config.find, {
            id: id
        }, function(data) {
            if ("undefined" == typeof data['row']) {
                return report('Nenhum resultado encontrado!', ALERT)
                // Listagem de dados
                 APP_PAGE.list();
            }

            TMPX = data;

            // Limpando lista de arquivo
            SENDFILE.clear();

            // Pegando lista de arquivos anexados
            SENDFILE.list('infracao', id);

             // Resetando os DropDowns
            $('.edit .ui.dropdown').dropdown('restore defaults');


            // Inserindo os dados no formulário
            $('#id').val(data.row.id);
            $('#tipo_infracao').dropdown('set selected', data.row.tipo_infracao);
            $('#veiculo').dropdown('set selected', data.row.veiculo);
            $('#cliente').dropdown('set selected', data.row.cliente);
            $('#data').val(data.row.data);
            $('#hora').val(data.row.hora);
            $('#valor').val(floatToReal(data.row.valor));
            $('#auto_infracao').val(data.row.auto_infracao);
            $('#auto_renainf').val(data.row.auto_renainf);
            $('#numero_processamento').val(data.row.numero_processamento);
            $('#tipo').dropdown('set selected', data.row.tipo);
            $('#endereco').val(data.row.endereco);
            $('#expedicao').val(data.row.expedicao);
            $('#vencimento').val(data.row.vencimento);
            $('#notificacao').val(data.row.notificacao);
            $('#data_pg').val(data.row.data_pg);
            $('#valor_pg').val(floatToReal(data.row.valor_pg));
            $('#obs').val(data.row.obs);

            // Barra de Título
            $("title").html(APP_PAGE.config.title + ' / Edição')
            $("#toptitle").html(APP_PAGE.config.title + ' / Edição')

            // Visualização
            APP_PAGE.display('edit')
        })
    },

    // Add --> para EMPRESA : TODO criar um sistema para todos os outros
    add: function() {

        // Limpando lista de arquivo
        SENDFILE.clear();

        $('#id').val(0);
        $('#tipo_infracao').val('');
        $('#veiculo').val('');
        $('#cliente').val('');
        $('#data').val('');
        $('#hora').val('');
        $('#valor').val('0,00');
        $('#auto_infracao').val('');
        $('#auto_renainf').val('');
        $('#numero_processamento').val('');
        $('#tipo').val('');
        $('#endereco').val('');
        $('#expedicao').val('');
        $('#vencimento').val('');
        $('#notificacao').val('');
        $('#data_pg').val('');
        $('#valor_pg').val('0,00');
        $('#obs').val('');

        // Resetando os DropDowns
        $('.edit .ui.dropdown').dropdown('restore defaults');

        // Barra de Título
        $("title").html(APP_PAGE.config.title + ' / Novo')
        $("#toptitle").html(APP_PAGE.config.title + ' / Novo')

        // Visualização
        APP_PAGE.display('edit')
    },

    // SAVE --> para EMPRESA : TODO criar um sistema para todos os outros
    save: function() {

        // Validações        
        var data = {
            id: $('#id').val(),
            tipo_infracao: $('#tipo_infracao').dropdown('get value'),
            veiculo: $('#veiculo').dropdown('get value'),
            cliente: $('#cliente').dropdown('get value'),
            data: $('#data').val(),
            hora: $('#hora').val(),
            valor: realToFloat($('#valor').val()),
            auto_infracao: $('#auto_infracao').val(),
            auto_renainf: $('#auto_renainf').val(),
            numero_processamento: $('#numero_processamento').val(),
            tipo: $('#tipo').val(),
            endereco: $('#endereco').val(),
            expedicao: $('#expedicao').val(),
            vencimento: $('#vencimento').val(),
            //notificacao: $('#notificacao').val(),
            data_pg: $('#data_pg').val(),
            valor_pg: realToFloat($('#valor_pg').val()),
            obs: $('#obs').val()
        }

       if (data.tipo_infracao == "0" || data.tipo_infracao == null) {
            $("#tipo_infracao").focus();
            return report('É obrigatório indicar um <b>Tipo de Infração</b>!', ALERT);
        }
       if (data.veiculo == "0" || data.veiculo == null) {
            $("#veiculo").focus();
            return report('É obrigatório indicar um <b>Veículo</b>!', ALERT);
        }
        if (data.cliente == "0" || data.cliente == null) {
            $("#cliente").focus();
            return report('É obrigatório indicar um <b>Cliente</b>!', ALERT);
        }
        if (data.data == '') {
            $("#data").focus();
            return report('É obrigatório indicar uma <b>Data</b>!', ALERT);
        }
        if (data.valor == 0 && data.tipo == 'M') {
            $("#valor").focus();
            return report('É obrigatório indicar uma <b>Valor para Multa</b>!', ALERT);
        }

        // Enviando
        SERVER.send(APP_PAGE.config.save, data, function(data) {

            if ("undefined" == typeof data['msg']) {
                return report('Não consegui salvar o registro!', ALERT)
            }

            // Enviando arquivos anexados
            SENDFILE.save('infracao', data.id);

            // Resetando os DropDowns
            $('.edit .ui.dropdown').dropdown('restore defaults');

            report(data.msg, INFO);
            return APP_PAGE.goSearch();
        })
    },

    // Botão de cancelar (fechar) o formulário de edição
    cancel: function() {
        // Barra de Título
        $("title").html(APP_PAGE.config.title + ' / Listagem')
        $("#toptitle").html(APP_PAGE.config.title + ' / Listagem')

        APP_PAGE.display('list')
    },

    // DELETE --> para EMPRESA : TODO criar um sistema para todos os outros
    delete: function(id) {
        SERVER.send(APP_PAGE.config.delete, {
            id: id
        }, function(data) {
            if ("undefined" == typeof data['msg']) {
                return report('Não consegui apagar o registro!', ALERT)
            }

            report(data.msg, INFO);
            return APP_PAGE.goSearch(APP_LANCAMENTO.list_page_atual);
        })
    },

    // Restaurar um ítem apagado
    undelete: function(id) {
        SERVER.send(APP_PAGE.config.undelete, {
            id: id
        }, function(data) {
            if ("undefined" == typeof data['msg']) {
                return report('Não consegui apagar o registro!', ALERT)
            }

            report(data.msg, INFO);
            return APP_PAGE.goSearch(APP_LANCAMENTO.list_page_atual);
        })
    },

    // Pegando a listagem de Tipo de Infração
    getTipoInfracao: function(){
        SERVER.send(APP_PAGE.config.tipoinfracao, {}, function(data){
            TMP = data.row;
            var op = data.row.map((a) => {
                return '<option value="'+a.id+'">'+a.codigo+' - '+a.nome+'</option>';
            })
            $("#tipo_infracao").html(op);
        })
    }


}

// RUNNING ...
$(document).ready(function(){APP_PAGE.start()})