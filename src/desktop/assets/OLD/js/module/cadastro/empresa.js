/**
 * Cadastro da Empresa e suas filiais
 * 
 */
APP_PAGE = {

    config: {
        title: 'Cadastro da Empresa',
        tipo: 'empresa',

        list: SERVER_URL + '/cadastro/empresa/search/',
        find: SERVER_URL + '/cadastro/empresa/find/',
        save: SERVER_URL + '/cadastro/empresa/save/',
        delete: SERVER_URL + '/cadastro/empresa/delete/',
        undelete: SERVER_URL + '/cadastro/empresa/undelete/',

        pais: SERVER_URL + '/cadastro/pais/list',
        estado: SERVER_URL + '/cadastro/estado/list',
        cidade: SERVER_URL + '/cadastro/cidade/list'
    },

    // Start this page
    start: function() {

        // Para mudar o tipo de empresa (somente EMPRESA)
        if ("undefined" != typeof APP_CADASTRO.page[APP_MODULE_PAGE].tipo) {
            APP_PAGE.config.tipo = APP_CADASTRO.page[APP_MODULE_PAGE].tipo
            APP_PAGE.config.title = APP_CADASTRO.page[APP_MODULE_PAGE].title
        }

        $("title").html(APP_PAGE.config.title)
        $("#toptitle").html(APP_PAGE.config.title);

        // coloca a opção em FALSE, ao iniciar
        document.getElementById('buscar_lixeira').checked = false;

        // Escutando o input FILE
        $('#file').on('change', function(e){SENDFILE.add(e)});

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
        $("#buscar_order").html('<option value="nome_fantasia">Nome Fantasia</option>');
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

    //Edição || Visualização dos dados --> para EMPRESA : TODO criar um sistema para todos os outros
    edit: function(id) {

        SERVER.send(APP_PAGE.config.find, {
            id: id
        }, function(data) {
            if ("undefined" == typeof data['row']) {
                return report('Nenhum resultado encontrado!', ALERT)
            }
            // Limpando lista de arquivo
            SENDFILE.clear();

            // Pegando lista de arquivos anexados
            SENDFILE.list('empresa', id);

            // Pega alistagem de países, estado e cidade
            APP_PAGE.getPais(data.row.pais);
            APP_PAGE.changePais(data.row.pais, data.row.estado);
            APP_PAGE.changeEstado(data.row.estado, data.row.cidade);

            // Inserindo os dados no formulário
            $('#id').val(data.row.id);
            $('#nome_fantasia').val(data.row.nome_fantasia);
            $('#razao_social').val(data.row.razao_social);
            $('#cnpj').val(data.row.cnpj);
            $('#site').val(data.row.site);
            $('#bairro').val(data.row.bairro);
            $('#endereco').val(data.row.endereco);
            $('#numero').val(data.row.numero);
            $('#cep').val(data.row.cep);
            $('#banco').val(data.row.banco);
            $('#agencia').val(data.row.agencia);
            $('#conta').val(data.row.conta);
            $('#obs').val(data.row.obs);

            // Pouvoa os contatos
            APP_PAGE.insertContatos(data.contato);

            // Máscaras de digitação - reset
            APP_PAGE.mask();

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

    // Add --> para EMPRESA : TODO criar um sistema para todos os outros
    add: function() {

        // Limpando lista de arquivo
        SENDFILE.clear();

        // Pega alistagem de países, estado e cidade
        APP_PAGE.getPais(1);
        APP_PAGE.changePais(1, 3);
        APP_PAGE.changeEstado(3);

        $('#id').val(0);
        $('#nome_fantasia').val('');
        $('#razao_social').val('');
        $('#cnpj').val('');
        $('#site').val('');
        $('#bairro').val('');
        $('#endereco').val('');
        $('#numero').val('');
        $('#cep').val('');
        $('#banco').val('');
        $('#agencia').val('');
        $('#conta').val('');
        $('#obs').val('');

        // Limpando o cadastro dos contatos
        APP_PAGE.clearContato();

        // Máscaras de digitação - reset
        APP_PAGE.mask();

        $("#deleted_dsp").hide();
        document.getElementById('deleted').checked = false;

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
            nome_fantasia: $('#nome_fantasia').val(),
            razao_social: $('#razao_social').val(),
            cnpj: $('#cnpj').val(),
            site: $('#site').val(),
            pais: $('#pais').val(),
            estado: $('#estado').val(),
            cidade: $('#cidade').val(),
            bairro: $('#bairro').val(),
            endereco: $('#endereco').val(),
            numero: $('#numero').val(),
            cep: $('#cep').val(),
            banco: $('#banco').val(),
            agencia: $('#agencia').val(),
            conta: $('#conta').val(),
            obs: $('#obs').val(),
            deleted: document.getElementById('deleted').checked,
            tipo: APP_PAGE.config.tipo
        }


        if (data.nome_fantasia.trim() == '') {
            $("#nome_fantasia").focus();
            return report('É obrigatório indicar um <b>Nome Fantasia</b>!', ALERT);
        }

        if (data.razao_social.trim() == '') {
            report('Não é obrigatório, mas, é recomendado indicar uma <b>Razão Social</b>.', INFO);
        }

        if (data.cnpj.trim() == '') {
            $("#cnpj").focus();
            return report('É preciso indicar o CNPJ!', WARN);
        }

        // Pegando os contatos
        data['contato'] = APP_PAGE.getContato();
        if (data['contato'] === false) return report('Você deve indicar pelo menos um contato!');

        // Enviando
        SERVER.send(APP_PAGE.config.save, data, function(data) {

            if ("undefined" == typeof data['msg']) {
                return report('Não consegui salvar o registro!', ALERT)
            }

            // Enviando arquivos anexados
            SENDFILE.save('empresa', data.id);

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

    /**
     * FUNÇÕES AUXILIARES -----------------------------------------------------
     *
     * 
     */

    // Pegando o País
    getPais: function(id) {
        SERVER.send(APP_PAGE.config.pais, {}, function(data) {
            var op = '';
            for (var i in data.row) {
                var s = data.row[i].id == id ? ' selected ' : '';
                op += '<option value="' + data.row[i].id + '"' + s + '>' + data.row[i].nome + ' - ' + data.row[i].sigla + '</option>';
            }
            $("#pais").html(op);
        })
    },

    // Troca do país
    changePais: function(pais, estado) {
        var estado = estado || false;
        var pais = pais || false;
        var p = pais !== false ? pais : $("#pais").val();

        SERVER.send(APP_PAGE.config.estado, {
            pais: p
        }, function(data) {
            var op = '';
            for (var i in data.row) {
                var s = data.row[i].id == estado ? ' selected ' : '';
                op += '<option value="' + data.row[i].id + '"' + s + '>' + data.row[i].nome + ' - ' + data.row[i].uf + '</option>';
            }
            $("#estado").html(op);
        })
    },

    // Troca do Estado
    changeEstado: function(estado, cidade) {
        var cidade = cidade || false;
        var estado = estado || false;
        var e = estado !== false ? estado : $("#estado").val();
        SERVER.send(APP_PAGE.config.cidade, {
            estado: e
        }, function(data) {
            var op = '';
            for (var i in data.row) {
                var s = data.row[i].id == cidade ? ' selected ' : '';
                op += '<option value="' + data.row[i].id + '"' + s + '>' + data.row[i].nome + '</option>';
            }
            $("#cidade").html(op);
        })
    },

    // Adicionar contato
    addContato: function() {
        var contato = 
        '<div class="contatos"><div class="ui divider"></div>' +
            '<div class="eleven wide field">' +
                '<label>Nome</label>' +
                '<input name="nome" placeholder="Nome" maxlength="45">' +
            '</div>' +
            
            '<div class="field">' +
                '<div class="fields">' +
                    '<div class="five wide field">' +
                        '<label>Telefone</label>' +
                        '<input type="text" name="telefone" class="telefone" placeholder="(99) 9999-9999" maxlength="255">' +
                    '</div>' +
                    
                    '<div class="five wide field">' +
                        '<label>Telefone</label>' +
                        '<input type="text" name="telefone1" class="telefone" placeholder="(99) 9999-9999" maxlength="255">' +
                    '</div>' +
            '</div></div>' +

            '<div class="field">' +
                '<div class="fields">' +
                    '<div class="five wide field">' +
                        '<label>Celular</label>' +
                        '<input type="text" name="celular" class="celular" placeholder="(99) 99999-9999" maxlength="255">' +
                    '</div>' +
                    
                    '<div class="five wide field">' +
                        '<label>Celular</label>' +
                        '<input type="text" name="celular1" class="celular" placeholder="(99) 99999-9999" maxlength="255">' +
                    '</div>' +
            '</div></div>' +
            
            '<div class="eleven wide field">' +
                '<label>E-mail</label>' +
                '<input type="text" name="email" placeholder="contato@email.com" maxlength="255">' +
            '</div>' +
            
            '<div class="field">' +
                '<label>Observação</label>' +
                '<textarea name="obs" placeholder="Observações, comentários ..." rows="2" maxlength="1000"></textarea>' +
            '</div>' +
            
            '<button type="button" onclick="this.parentElement.remove()" class="mini ui red icon button" data-tooltip="Remover este contato" data-position="bottom left"><i class="minus icon"></i></button>' +
        '</div>';

        $("#contato").append(contato);
        APP_PAGE.mask();
    },

    // Pegar os contatos
    getContato: function() {
        var c = document.querySelectorAll('.contatos');
        var d = [];
        for (var i in c) {
            if ("undefined" === typeof c[i]['id']) continue;
            d[i] = {
                nome: c[i].querySelector('input[name=nome]').value.trim(),
                telefone: c[i].querySelector('input[name=telefone]').value.trim(),
                telefone1: c[i].querySelector('input[name=telefone1]').value.trim(),
                celular: c[i].querySelector('input[name=celular]').value.trim(),
                celular1: c[i].querySelector('input[name=celular1]').value.trim(),
                email: c[i].querySelector('input[name=email]').value.trim(),
                obs: c[i].querySelector('textarea[name=obs]').innerHTML.trim()
            }

            if (d[i].nome == '') {
                c[i].querySelector('input[name=nome]').focus();
                report('É preciso indicar um <b>Nome</b> para o contato!', ALERT);
                return false;
            }
            if (d[i].telefone == '' && d[i].telefone1 == '' && d[i].celular == '' && d[i].celular1 == '' && d[i].email == '') {
                c[i].querySelector('input[name=nome]').focus();
                report('É preciso indicar, pelo menos, uma forma de contato (telefone, celular ou e-mail)!', ALERT);
                return false;
            }

        }

        if (d.length == 0) return false;
        return d;
    },

    // limpando o formulário
    clearContato: function() {
        var contato = 
        '<div class="contatos">' +
            '<div class="eleven wide field">' +
                '<label>Nome</label>' +
                '<input name="nome" placeholder="Nome" maxlength="45">' +
            '</div>' +

            '<div class="field">' +
                '<div class="fields">' +
                    '<div class="five wide field">' +
                        '<label>Telefone</label>' +
                        '<input type="text" name="telefone" class="telefone" placeholder="(99) 9999-9999" maxlength="255">' +
                    '</div>' +
                    
                    '<div class="five wide field">' +
                        '<label>Telefone</label>' +
                        '<input type="text" name="telefone1" class="telefone" placeholder="(99) 9999-9999" maxlength="255">' +
                    '</div>' +
            '</div></div>' +

            '<div class="field">' +
                '<div class="fields">' +
                    '<div class="five wide field">' +
                        '<label>Celular</label>' +
                        '<input type="text" name="celular" class="celular" placeholder="(99) 99999-9999" maxlength="255">' +
                    '</div>' +
                    
                    '<div class="five wide field">' +
                        '<label>Celular</label>' +
                        '<input type="text" name="celular1" class="celular" placeholder="(99) 99999-9999" maxlength="255">' +
                    '</div>' +
            '</div></div>' +

            '<div class="eleven wide field">' +
                '<label>E-mail</label>' +
                '<input type="text" name="email" placeholder="contato@email.com" maxlength="255">' +
            '</div>' +

            '<div class="field">' +
                '<label>Observação</label>' +
                '<textarea name="obs" placeholder="Observações, comentários ..." rows="2" maxlength="1000"></textarea>' +
            '</div>' +
            
        '</div>';
        
        $("#contato").html(contato);
        APP_PAGE.mask();
    },

    // Pega os dados de contato
    insertContatos: function(contato) {

        var botao = '<button type="button" onclick="this.parentElement.remove()" class="mini ui red icon button" data-tooltip="Remover este contato" data-position="bottom left"><i class="minus icon"></i></button>';

        $("#contato").html('');

        var c = 0;
        for (var i in contato) {

            $("#contato").append('<div class="contatos">' + (c > 0 ? '<div class="ui divider"></div>' : '') +
                '<div class="eleven wide field">' +
                    '<label>Nome</label>' +
                    '<input name="nome" placeholder="Nome" maxlength="45" value="' + contato[i].nome + '">' +
                '</div>' +
                
                '<div class="field">' +
                    '<div class="fields">' +
                        '<div class="five wide field">' +
                            '<label>Telefone</label>' +
                            '<input type="text" name="telefone" class="telefone" placeholder="(99) 9999-9999" maxlength="255" value="' + contato[i].telefone + '">' +
                        '</div>' +

                        '<div class="five wide field">' +
                            '<label>Telefone</label>' +
                            '<input type="text" name="telefone1" class="telefone" placeholder="(99) 9999-9999" maxlength="255" value="' + contato[i].telefone1 + '">' +
                        '</div>' +
                '</div></div>' +

                '<div class="field">' +
                    '<div class="fields">' +                        
                        '<div class="five wide field">' +
                            '<label>Celular</label>' +
                            '<input type="text" name="celular" class="celular" placeholder="(99) 99999-9999" maxlength="255" value="' + contato[i].celular + '">' +
                        '</div>' +

                        '<div class="five wide field">' +
                            '<label>Celular</label>' +
                            '<input type="text" name="celular1" class="celular" placeholder="(99) 99999-9999" maxlength="255" value="' + contato[i].celular1 + '">' +
                        '</div>' +
                '</div></div>' +

                '<div class="eleven wide field">' +
                    '<label>E-mail</label>' +
                    '<input type="text" name="email" placeholder="contato@email.com" maxlength="255" value="' + contato[i].email + '">' +
                '</div>' +                

                '<div class="field">' +
                    '<label>Observação</label>' +
                    '<textarea name="obs" placeholder="Observações, comentários ..." rows="2" maxlength="1000">' + contato[i].obs + '</textarea>' +
                '</div>' +

                (c > 0 ? botao : '') + '</div>');
            c++;
        }
        APP_PAGE.mask();
    },

    // Reset máscaras de digitação
    mask: function(){
        $('.telefone').mask('(99) 9999-9999');
        $('.celular').mask('(99) 99999-9999');
    }
}

// RUNNING ...
$(document).ready(function(){APP_PAGE.start()})