/**
 * Cadastro da Empresa e suas filiais
 * 
 */
APP_PAGE = {

    config: {
        title: 'Venda',
        tipo: 'venda',

        list: SERVER_URL + '/cadastro/venda/search/',
        find: SERVER_URL + '/cadastro/venda/find/',
        save: SERVER_URL + '/cadastro/venda/save/',
        delete: SERVER_URL + '/cadastro/venda/delete/',

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

            // Limpando lista de arquivo
            SENDFILE.clear();

            // Pegando lista de arquivos anexados
            SENDFILE.list('venda', id);

            // Resetando os DropDowns
            $('.edit .ui.dropdown').dropdown('restore defaults');

            // Inserindo os dados no formulário
            $('#id').val(data.row.id);
            $('#veiculo').dropdown('set selected', data.row.veiculo);
            $('#comprador').val(data.row.comprador);
            $('#telefone').val(data.row.telefone);
            $('#celular').val(data.row.celular);
            $('#forma_pg').dropdown('set selected', data.row.forma_pg);
            $('#numero_parcela').val(data.row.numero_parcela);
            $('#valor_parcela').val(floatToReal(data.row.valor_parcela));
            $('#valor').val(floatToReal(data.row.valor));
            $('#data').val(data.row.data);       
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
        $('#veiculo').val('');
        $('#comprador').val('');
        $('#telefone').val('');
        $('#celular').val('');
        $('#forma_pg').val('');
        $('#numero_parcela').val('');
        $('#valor_parcela').val('0,00');
        $('#valor').val('0,00');
        $('#data').val('');         
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
            veiculo: $('#veiculo').dropdown('get value'),
            comprador: $('#comprador').val(),
            telefone: $('#telefone').val(),
            celular: $('#celular').val(),
            forma_pg: $('#forma_pg').val(),
            numero_parcela: $('#numero_parcela').val(),
            valor_parcela: realToFloat($('#valor_parcela').val()),
            valor: realToFloat($('#valor').val()),
            data: $('#data').val(),
            obs: $('#obs').val()
        }

       
        if (data.veiculo.trim() == '') {
            $("#veiculo").focus();
            report('É obrigatório indicar um <b>Veículo</b>!', ALERT);
        }

        // Enviando
        SERVER.send(APP_PAGE.config.save, data, function(data) {

            if ("undefined" == typeof data['msg']) {
                return report('Não consegui salvar o registro!', ALERT)
            }

            // Enviando arquivos anexados
            SENDFILE.save('venda', data.id);

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
    }

}

// RUNNING ...
$(document).ready(function(){APP_PAGE.start()})