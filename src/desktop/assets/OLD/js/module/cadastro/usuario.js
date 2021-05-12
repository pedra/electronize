/**
 * Cadastro de usuários
 * 
 */
APP_PAGE = {

    config: {
        title: 'Cadastro de Usuário',
        list: SERVER_URL + '/cadastro/usuario/search/',
        find: SERVER_URL + '/cadastro/usuario/find/',
        save: SERVER_URL + '/cadastro/usuario/save/',
        delete: SERVER_URL + '/cadastro/usuario/delete/',
        undelete: SERVER_URL + '/cadastro/usuario/undelete/',
    },

    // Start this page
    start: function() {

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

        // ouvindo changes em estado e cidade
        $('#pais').on('change', function() {
            APP_PAGE.changePais()
        })
        $('#estado').on('change', function() {
            APP_PAGE.changeEstado()
        })

        // Campos de busca
        $("#buscar_order").html('<option values="nome_fantasia">Nome Fantasia</option>');
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

    //Edição || Visualização dos dados --> para USUARIO : TODO criar um sistema para todos os outros
    edit: function(id) {

        SERVER.send(APP_PAGE.config.find, {
            id: id
        }, function(data) {
            if ("undefined" == typeof data['row']) {
                return report('Nenhum resultado encontrado!', ALERT)
            }

            $('#id').val(data.row.id);
            $('#nome').val(data.row.nome);
            $('#login').val(data.row.login);
            $('#senha').val('');
            document.getElementById('nivel').checked = (data.row.nivel == 'admin' ? true : false);
            document.getElementById('deleted').checked = false;

            if (data.row.deleted == false) {
                $("#deleted_dsp").hide()
            } else {
                $("#deleted_dsp").show()
            }

            // Barra de Título
            $("title").html(APP_PAGE.config.title + ' / Edição')
            $("#toptitle").html(APP_PAGE.config.title + ' / Edição')
            $("#editTitle").html(APP_PAGE.config.title + ' / Edição')

            // Visualização
            APP_PAGE.display('edit')
        })
    },

    // Add --> para USUARIO : TODO criar um sistema para todos os outros
    add: function() {
        $('#id').val(0);
        $('#nome').val('');
        $('#login').val('');
        $('#senha').val('');
        document.getElementById('nivel').checked = false;
        $("#deleted_dsp").hide();

        // Barra de Título
        $("title").html(APP_PAGE.config.title + ' / Novo')
        $("#toptitle").html(APP_PAGE.config.title + ' / Novo')
        $("#editTitle").html(APP_PAGE.config.title + ' / Novo')

        // Visualização
        APP_PAGE.display('edit')
    },

    // SAVE --> para USUARIO : TODO criar um sistema para todos os outros
    save: function() {

        // Validações        
        var data = {
            id: $("#id").val(),
            nome: $("#nome").val(),
            login: $("#login").val(),
            senha: $("#senha").val(),
            nivel: (document.getElementById('nivel').checked == true ? 'admin' : 'normal'),
            deleted: document.getElementById('deleted').checked
        }

        if (data.login.trim() == '') {
            $("#login").focus();
            return report('É obrigatório indicar um <b>login</b>!', ALERT);
        }

        var r = /^[a-z0-9\.\@]+$/;
        if (data.login.trim().match(r) == null) {
            $("#login").focus();
            return report('O login deve conter <b>somente</b> letras minúsculas, números e "." (ponto)');
        }

        if (data.nome.trim() == '') {
            report('Não é obrigatório, mas, é recomendado indicar um <b>nome</b>.', INFO);
        }

        if (data.id == 0 && data.senha.trim() == '') {
            report('Como não foi indicada, será usada a senha padrão: <b>senha123</b>!', WARN);
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
    }
}

// RUNNING ...
$(document).ready(function(){APP_PAGE.start()})