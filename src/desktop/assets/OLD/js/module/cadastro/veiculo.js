/**
 * Cadastro de usuários
 * 
 */

//let TMP4 = '';
APP_PAGE = {

    config: {
        title: 'Cadastro de Veículo',
        
        modelos: SERVER_URL + '/cadastro/modelo/list/', //para busca
        empresas: SERVER_URL + '/cadastro/empresa/list/', //para busca

        list: SERVER_URL + '/cadastro/veiculo/search',
        find: SERVER_URL + '/cadastro/veiculo/find/',
        save: SERVER_URL + '/cadastro/veiculo/save/',
        delete: SERVER_URL + '/cadastro/veiculo/delete/',
        undelete: SERVER_URL + '/cadastro/veiculo/undelete/',
    },
    modelos: {},
    concessionarias: {},
    seguradoras: {},
    clientes: {},

    // Start this page
    start: function() {

        APP_PAGE.getModelos(); // pegando lista de modelos de veículos
        APP_PAGE.getConcessionaria() // lista de concessionárias
        APP_PAGE.getSeguradora() // idem
        APP_PAGE.getCliente() //idem

        //Evento keydown nos imput numéricos
        $("#numero_parcela").on('keydown', kdnumber)
        $("#valor_parcela").on('keydown', kdnumber)
        $("#valor_compra").on('keydown', kdnumber)
        $("#valor_seguro").on('keydown', kdnumber)
        $("#valor_locacao").on('keydown', kdnumber)
        $("#km").on('keydown', kdnumber)

        // Escutando o input FILE
        $('#file').on('change', function(e){SENDFILE.add(e)});

        // Atualizando Titulos
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

            // mostra listagem
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
            // mostra listagem
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
        table += '<th></th><th></th></tr></thead><tbody>';
        $("#buscar_order").html(op);

        for (var i in data.row) {
            if (i == 'title') {
                continue
            }

            table += '<tr class="table-edit">';
            for (var x in data.title) {
                if(x == 'id' || x == 'deleted' || "undefined" == typeof data.row[i][x]) {
                    continue
                }
                table += '<td title="Click para editar" onclick="APP_PAGE.edit(\'' + data.row[i].id + '\')">' + data.row[i][x] + '</td>';
            }

            // Mostrando arquivos anexados
            if(data.row[i]['arquivo'] == false) {
                table += '<td width="44px">'
                        +'<button class="ui icon button basic"'
                        +' data-tooltip="Apagar" data-html="Arquivo será mostrado aqui..." data-inverted="" data-position="bottom center">'
                        +'<i class="file outline icon"></i></button></td>'
            } else {
                table += '<td width="44px">'
                        +'<button class="ui icon button basic"'
                        +' data-tooltip="Apagar" data-html="Arquivo será mostrado aqui..." data-inverted="" data-position="bottom center">'
                        +'<i class="file alternate icon"></i></button></td>'

                        // '<td width="44px">'
                        // +'<button class="ui icon button basic xarquivo"><i class="file alternate icon"></i></button>'
                        // +'<div class="ui flowing popup center center transition hidden  xarquivo">'
                        // +'Os arquivos aparecerão aqui ...'
                        // +'</div>'
                        // +'</td>'
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

        // Ativando os POPUPS
        //$('.button.xarquivo').popup()
    },

    //Edição || Visualização dos dados --> para FABRICANTE : TODO criar um sistema para todos os outros
    edit: function(id) {

        SERVER.send(APP_PAGE.config.find, {
            id: id
        }, function(data) { TMP3 = data
            if ("undefined" == typeof data['row']) {
                return report('Nenhum resultado encontrado!', ALERT)
            }

            // Limpando lista de arquivo
            SENDFILE.clear();

            // Pegando lista de arquivos anexados
            SENDFILE.list('veiculo', id);

            // Resetando os DropDowns
            $('.edit .ui.dropdown').dropdown('restore defaults');

            // Inserindo os dados no formulário            
            $('#id').val(data.row.id);

            $('#placa').val(data.row.placa); 
            $('#chassi').val(data.row.chassi); 
            $('#renavam').val(data.row.renavam);
            $('#modelo_nome').val(data.row.modelo_nome);
            $('#modelo').val(data.row.modelo);
            $('#modelo_combustivel').val(data.row.modelo_combustivel);
            $('#modelo_ano').val(data.row.modelo_ano);
            $('#fabricacao').val(data.row.fabricacao);

            $('#concessionaria_nome').val(data.row.concessionaria_nome);
            $('#concessionaria').val(data.row.concessionaria);
            $('#tipo_compra').dropdown('set selected', data.row.tipo_compra);
            $('#danfe').val(data.row.danfe);
            $('#nota_fiscal').val(data.row.nota_fiscal);
            $('#contrato_financiamento').val(data.row.contrato_financiamento);
            $('#numero_parcela').val(data.row.numero_parcela);
            $('#valor_parcela').val(floatToReal(data.row.valor_parcela));
            $('#valor_compra').val(floatToReal(data.row.valor_compra));
            $('#vendedor').val(data.row.vendedor);

            $('#seguradora_nome').val(data.row.seguradora_nome);
            $('#seguradora').val(data.row.seguradora);
            $('#item_seguro').val(data.row.item_seguro);
            $('#inicio_seguro').val(data.row.inicio_seguro);
            $('#fim_seguro').val(data.row.fim_seguro);
            $('#valor_seguro').val(floatToReal(data.row.valor_seguro));

            $('#cliente_nome').val(data.row.cliente_nome);
            $('#cliente').val(data.row.cliente);
            $('#contrato_cliente').val(data.row.contrato_cliente);
            $('#inicio_contrato').val(data.row.inicio_contrato);
            $('#fim_contrato').val(data.row.fim_contrato);
            $('#valor_locacao').val(floatToReal(data.row.valor_locacao));
            $('#km').val(data.row.km);
            $('#data_entrada').val(data.row.data_entrada);
            $('#data_saida').val(data.row.data_saida);

            $('#status').dropdown('set selected', data.row.status);
            $('#obs').val(data.row.obs);

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

        // Limpando lista de arquivo
        SENDFILE.clear();

        $('#id').val(0);

        $('#placa').val(''); 
        $('#chassi').val(''); 
        $('#renavam').val('');
        $('#modelo_nome').val('');
        $('#modelo').val('');
        $('#modelo_combustivel').val('');
        $('#modelo_ano').val('');
        $('#fabricacao').val('');

        $('#concessionaria_nome').val('');
        $('#concessionaria').val('');
        $('#tipo_compra').val('');
        $('#danfe').val('');
        $('#nota_fiscal').val('');
        $('#contrato_financiamento').val('');
        $('#numero_parcela').val('');
        $('#valor_parcela').val('0,00');
        $('#valor_compra').val('0,00');
        $('#vendedor').val('');

        $('#seguradora_nome').val('');
        $('#seguradora').val('');
        $('#item_seguro').val('');
        $('#inicio_seguro').val('');
        $('#fim_seguro').val('');
        $('#valor_seguro').val('0,00');

        $('#cliente_nome').val('');
        $('#cliente').val('');
        $('#contrato_cliente').val('');
        $('#inicio_contrato').val('');
        $('#fim_contrato').val('');
        $('#valor_locacao').val('0,00');
        $('#km').val('');
        $('#data_entrada').val('');
        $('#data_saida').val('');

        $('#status').val('');
        $('#obs').val('');

        $('.edit .ui.dropdown').dropdown('restore defaults');       

        // Preparando o seletor de softDelete
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

        // Validações        
        var data = {
            id:             $('#id').val().trim(),
            placa:          $('#placa').val().trim(),
            chassi:         $('#chassi').val().trim(),
            renavam:        $('#renavam').val().trim(),
            modelo:         $('#modelo').val().trim(),
            fabricacao:     $('#fabricacao').val().trim(), 

            concessionaria: $('#concessionaria').val().trim(),
            tipo_compra:    $("#tipo_compra").dropdown('get value'),
            danfe:          $('#danfe').val().trim(),
            nota_fiscal:    $('#nota_fiscal').val().trim(),
            contrato_financiamento: $('#contrato_financiamento').val().trim(),
            numero_parcela: parseInt($('#numero_parcela').val().replace(/\.|,| /g,'')),
            valor_parcela:  realToFloat($('#valor_parcela').val()),
            valor_compra:   realToFloat($('#valor_compra').val()),
            vendedor:       $('#vendedor').val().trim(),

            seguradora:     $('#seguradora').val().trim(),
            item_seguro:    $('#item_seguro').val().trim(),
            inicio_seguro:  $('#inicio_seguro').val().trim(),
            fim_seguro:     $('#fim_seguro').val().trim(),
            valor_seguro:   realToFloat($('#valor_seguro').val()),

            cliente:        $('#cliente').val().trim(),
            contrato_cliente: $('#contrato_cliente').val().trim(),
            inicio_contrato: $('#inicio_contrato').val().trim(),
            fim_contrato:   $('#fim_contrato').val().trim(),
            valor_locacao:  realToFloat($('#valor_locacao').val()),
            km:             parseInt($('#km').val().replace(/\.|,| /g,'')),
            data_entrada:   $('#data_entrada').val().trim(),
            data_saida:     $('#data_saida').val().trim(),

            status:         $("#status").dropdown('get value'),
            obs:            $('#obs').val().trim(),
            deleted:        document.getElementById('deleted').checked                                              
        }

        // Validações
        if (data.placa == '') {
            $("#placa").focus();
            return report('É obrigatório indicar a <b>Placa do Veículo</b>!', ALERT);
        }
        if (data.chassi == '') {
            $("#chassi").focus();
            return report('É obrigatório indicar o <b>número do Chassi</b>!', ALERT);
        }
        if (data.renavam == '') {
            $("#renavam").focus();
            return report('É obrigatório indicar o <b>Renavam</b>!', ALERT);
        }
        if (data.modelo == '') {
            $("#modelo_nome").focus();
            return report('É obrigatório indicar o <b>Fabricante e Modelo</b>!', ALERT);
        }
        if (data.fabricacao == '') {
            $("#fabricacao").focus();
            return report('É obrigatório indicar o <b>Ano de Fabricação</b>!', ALERT);
        }


        // Enviando
        SERVER.send(APP_PAGE.config.save, data, function(data) { //console.log(data);

            if ("undefined" == typeof data['msg']) {
                return report('Não consegui salvar o registro!', ALERT)
            }

            // Resetando os DropDowns
            $('.edit .ui.dropdown').dropdown('restore defaults');

            // Enviando arquivos anexados
            SENDFILE.save('veiculo', data.id);

            report(data.msg, INFO);
            return APP_PAGE.goSearch();
        })
    },

    // Botão de cancelar (fechar) o formulário de edição
    cancel: function() {
        // Barra de Título
        $("title").html(APP_PAGE.config.title + ' / Listagem')
        $("#toptitle").html(APP_PAGE.config.title + ' / Listagem')

        // mostra a listagem
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
    

    // Abrir janela para outro cadastro
    openWindow: function(page) {
        ipcRenderer.send('openWindow', page);
    },
    
    
    // Pegar a lista de MODELOS
    getModelos: function(){
        //Pegando lista de modelos
        SERVER.send(APP_PAGE.config.modelos, {}, function(data){
            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            APP_PAGE.modelos = data.row.map((a) => {return {'id':a.id, 'title': a.fabricante+' - '+a.modelo+' ('+a.combustivel+') - '+a.ano, combustivel: a.combustivel, ano: a.ano}}); // SEARCH só reconhece o campo "title"

            $('.ui.search.modelo').search({
                source: APP_PAGE.modelos,
                fullTextSearch: true,
                error : {
                    noResults   : 'Não encontrei esse modelo!'
                },
                onSelect: function (result, response){
                    $("#modelo").val(result.id);
                    $("#modelo_combustivel").val(result.combustivel.capitalize());
                    $("#modelo_ano").val(result.ano);
                }
            });
        });
    },

    // Pegar a lista de MODELOS
    getConcessionaria: function(){
        //Pegando lista de modelos
        SERVER.send(APP_PAGE.config.empresas, {tipo: 'concessionaria'}, function(data){
            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            APP_PAGE.concessionarias = data.row.map((a) => {return {'id':a.id, 'title': a.nome_fantasia}});

            $('.ui.search.concessionaria').search({
                source: APP_PAGE.concessionarias,
                error : {
                    noResults   : 'Não encontrei essa Concessionária!'
                },
                onSelect: function (result, response){
                    $("#concessionaria").val(result.id);
                }
            });
        });
    },

    // Pegar a lista de MODELOS
    getSeguradora: function(){
        //Pegando lista de modelos
        SERVER.send(APP_PAGE.config.empresas, {tipo: 'seguradora'}, function(data){
            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            APP_PAGE.seguradoras = data.row.map((a) => {return {'id':a.id, 'title': a.nome_fantasia}});

            $('.ui.search.seguradora').search({
                source: APP_PAGE.seguradoras,
                error : {
                    noResults   : 'Não encontrei essa Seguradora!'
                },
                onSelect: function (result, response){
                    $("#seguradora").val(result.id);
                }
            });
        });
    },

    // Pegar a lista de MODELOS
    getCliente: function(){
        //Pegando lista de modelos
        SERVER.send(APP_PAGE.config.empresas, {tipo: 'cliente'}, function(data){
            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            APP_PAGE.clientes = data.row.map((a) => {return {'id':a.id, 'title': a.nome_fantasia}});

            $('.ui.search.cliente').search({
                source: APP_PAGE.clientes,
                error : {
                    noResults   : 'Não encontrei esse Cliente!'
                },
                onSelect: function (result, response){
                    $("#cliente").val(result.id);
                }
            });
        });
    }
}

// RUNNING ...
$(document).ready(function(){APP_PAGE.start()})