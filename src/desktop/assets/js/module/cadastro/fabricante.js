/**
 * Cadastro de usuários
 * 
 */
//let TMP4 = '';
APP_PAGE = {

    config: {
        title: 'Cadastro de Fabricante de Veículo',
        fabricantes: SERVER_URL + '/cadastro/fabricante/list/',
        list: SERVER_URL + '/cadastro/modelo/search',
        find: SERVER_URL + '/cadastro/modelo/find/',
        save: SERVER_URL + '/cadastro/modelo/save/',
        delete: SERVER_URL + '/cadastro/modelo/delete/',
        undelete: SERVER_URL + '/cadastro/modelo/undelete/',
    },
    fabricantes: {},

    // Start this page
    start: function() {

        APP_PAGE.getFabricantes();

        $("title").html(APP_PAGE.config.title)
        $("#toptitle").html(APP_PAGE.config.title);

        // coloca a opção em FALSE, ao iniciar
        document.getElementById('buscar_lixeira').checked = false;

        // Capturando referência aos campos de exibição do form
        APP_CADASTRO.listField = document.getElementById('list')
        APP_CADASTRO.editField = document.getElementById('edit')

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
    },

    // Mostra a listagem ou o formulário de edição
    display: function(d) {
        if(d == 'list') {
            APP_CADASTRO.editField.classList.remove('open')
            APP_CADASTRO.listField.classList.add('open')
            APP_CADASTRO.listField.scroll(0,0);
        } else {
            APP_CADASTRO.editField.classList.add('open')
            APP_CADASTRO.listField.classList.remove('open')
            APP_CADASTRO.editField.scroll(0,0);
        }
    },

    // Caixa de pesquiza
    search: function(e) {
        TMP = e;
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

        APP_CADASTRO.list_page_atual = page;

        // Barra de Título
        $("title").html(APP_PAGE.config.title + ' / Listagem')
        $("#toptitle").html(APP_PAGE.config.title + ' / Listagem')

        // Enviando solicitação
        SERVER.send(APP_PAGE.config.list, {
            r: rpp,
            p: page,
            q: query,
            o: order,
            t: trash
        }, function(data) {
            APP_PAGE.showList(data, query);
        })
    },

    // Monta o display de listagem dos registros
    showList: function(data, query) {

        if (data.page.total == 0) {
            // Visualização
            APP_PAGE.display('list')
            return APP_CADASTRO.listField.innerHTML = 'Nenhum resultado encontrado!';
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

        APP_CADASTRO.listField.innerHTML = table;

        // Visualização
        APP_PAGE.display('list')
    },

    //Edição || Visualização dos dados --> para FABRICANTE : TODO criar um sistema para todos os outros
    edit: function(id) {

        SERVER.send(APP_PAGE.config.find, {
            id: id
        }, function(data) {
            if ("undefined" == typeof data['row']) {
                return report('Nenhum resultado encontrado!', ALERT)
            }

            //console.log(data.row)

            // Inserindo os dados no formulário
            $('#id').val(data.row.id);
            $('#tipo').dropdown('set selected', data.row.tipo);
            $('#fabricante').val(data.row.nome_fabricante);
            $('#nome').val(data.row.nome);
            $('#ano').val(data.row.ano);
            $('#combustivel').dropdown('set selected', data.row.combustivel);
            $('#fipe_codigo').val(data.row.fipe_codigo);
            $('#valor').val(floatToReal(data.row.valor));

            document.getElementById('deleted').checked = false;

            if (data.row.deleted == false) {
                $("#deleted_dsp").hide()
            } else {
                $("#deleted_dsp").show()
            }

            // Barra de Título
            $("title").html(APP_PAGE.config.title + ' / Edição')
            $("#toptitle").html(APP_PAGE.config.title + ' / Edição')

            // Visualização
            APP_PAGE.display('edit')
        })
    },

    // Add --> para FABRICANTE : TODO criar um sistema para todos os outros
    add: function() {

        $('#id').val(0);
        $('#tipo').val('');
        $('#fabricante').val('');
        $('#nome').val('');
        $('#ano').val('');
        $('#combustivel').val('');
        $('#fipe_codigo').val('');
        $('#valor').val('');

        $('.edit .ui.dropdown').dropdown('restore defaults'); 

        $("#deleted_dsp").hide();
        document.getElementById('deleted').checked = false;

        // Barra de Título
        $("title").html(APP_PAGE.config.title + ' / Novo')
        $("#toptitle").html(APP_PAGE.config.title + ' / Novo')

        // Visualização
        APP_PAGE.display('edit')
    },


    // SAVE --> para FARICANTE : TODO criar um sistema para todos os outros
    save: function() {

        var fabricante = 0;
        APP_PAGE.fabricantes.map((a) => { if(a.title == $('#fabricante').val()) fabricante = parseInt(a.id)} ) 

        // Validações        
        var data = {
            id: $('#id').val(),
            tipo: $('#tipo').val(),
            fabricante:fabricante,
            fabricante_digitado: $("#fabricante").val(),
            nome: $('#nome').val(),
            ano: $('#ano').val(),
            combustivel: $('#combustivel').val(),
            fipe_codigo: $('#fipe_codigo').val(),
            valor: realToFloat($("#valor").val()),
            deleted: document.getElementById('deleted').checked
        }

        if ($('#fabricante').val().trim() == '') {
            $("#fabricante").focus();
            return report('É obrigatório indicar o <b>Fabricante</b>!', ALERT);
        }

        if (data.nome.trim() == '') {
            $("#nome").focus();
            return report('Faça uma descrição do modelo do veículo (você pode usar o padrão da FIPE)', ALERT);
        }

        if (data.tipo == '') {
            $("#tipo").focus();
            return report('Selecione o tipo de veículo.', ALERT);
        }

        if (data.combustivel == '') {
            $("#combustivel").focus();
            return report('Selecione o tipo de combustível.', ALERT);
        }

        // Caso seja um fabricante novo:
        if(data.fabricante == 0){
            APP_PAGE.getFabricantes();
        }

        // Enviando
        SERVER.send(APP_PAGE.config.save, data, function(data) {

            if ("undefined" == typeof data['msg']) {
                return report('Não consegui salvar o registro!', ALERT)
            }

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

    // DELETE --> para USUARIO : TODO criar um sistema para todos os outros
    delete: function(id) {
        SERVER.send(APP_PAGE.config.delete, {
            id: id
        }, function(data) {
            if ("undefined" == typeof data['msg']) {
                return report('Não consegui apagar o registro!', ALERT)
            }

            report(data.msg, INFO);
            return APP_PAGE.goSearch(APP_CADASTRO.list_page_atual);
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
            return APP_PAGE.goSearch(APP_CADASTRO.list_page_atual);
        })
    },

    // UTILS --------------------------------------------------
    
    // Pegar a lista de fabricantes
    getFabricantes: function(){
        //Pegando lista de fabricantes
        SERVER.send(APP_PAGE.config.fabricantes, {}, function(data){
            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            APP_PAGE.fabricantes = data.row.map((a) => {return {'id':a.id, 'title': a.nome}}); // SEARCH só reconhece o campo "title"
            $('.ui.search').search({
                source: APP_PAGE.fabricantes,
                error : {
                    noResults   : 'Vou salvar como um novo fabricante.'
                },
                onSelect: function (result, response){
                    //console.log(result, response)
                }
            });
        });
    }
}

// RUNNING ...
$(document).ready(function(){APP_PAGE.start()})