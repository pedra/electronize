/**
 * Cadastro da Empresa e suas filiais
 * 
 */
var TMP4 = '';
APP_PAGE = {

    config: {
        title: 'Contrato',

        veiculos: SERVER_URL + '/cadastro/veiculo/listcontrato', //para busca

        list: SERVER_URL + '/cadastro/contrato/search',
        find: SERVER_URL + '/cadastro/contrato/find',
        save: SERVER_URL + '/cadastro/contrato/save',
        delete: SERVER_URL + '/cadastro/contrato/delete',
        deleteVeiculo: SERVER_URL + '/cadastro/contrato/deleteveiculo',
        clientes: SERVER_URL + '/cadastro/empresa/list',
    },
    veiculosSearchData: [], // listagem para busca
    veiculosCarregados: [], // listagem dos veiculos disponíveis carregados do banco de dados 
    veiculos: [],           // listagem dos veículos adiconados anteriormente no banco
    veiculosNew: [],        // listagem dos novos veiculos adicionados
    valor: 0.00,            // valor (soma) dos veiculos no banco de dados (anterior)
    valorNew: 0.00,         // valor (soma) dos novos veiculos adicionados


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

        // Carregando lista de Clientes
        APP_PAGE.getClientes();

        // Pegando listagem de veículos
        APP_PAGE.getVeiculos();
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

        APP_PAGE.getVeiculos(); // atualiza a lista de veículos disponíveis

        SERVER.send(APP_PAGE.config.find, {
            id: id
        }, function(data) {
            if ("undefined" == typeof data['row']) {
                APP_PAGE.list();
                return report('Nenhum resultado encontrado!', ALERT)
            }

            // Limpando lista de arquivo
            SENDFILE.clear();

            // Pegando lista de arquivos anexados
            SENDFILE.list('contrato', id);

            // Resetando os DropDowns
            $('.edit .ui.dropdown').dropdown('restore defaults');

            // Inserindo os dados no formulário
            $('#id').val(data.row.id);
            $('#cliente').dropdown('set selected', data.row.cliente);
            $('#numero').val(data.row.numero);
            $('#inicio').val(data.row.inicio);
            $('#fim').val(data.row.fim);
            $('#valor').val(floatToReal(data.row.valor));
            $('#obs').val(data.row.obs);

            $(".veiculolist").html('');
            $(".results").html('');
            $("#addveiculo").val('');

            // Limpando a listagem de novos veículos
            APP_PAGE.showNew();

            // Limpando a listagem
            APP_PAGE.veiculos = [];
            // Carregando os veículos cadastrados
            if("undefined" != typeof data['veiculo']){ //console.log('data.veiculo', data.veiculo)
                APP_PAGE.veiculos = data.veiculo;
                // Atualizando na tela
                APP_PAGE.show();
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
        APP_PAGE.getVeiculos(); // atualiza a lista de veículos disponíveis        
        APP_PAGE.showNew();     // Limpando a listagem de novos veículos

        // Limpando lista de arquivo
        SENDFILE.clear();

        $('#id').val(0);
        $('#cliente').val('');
        $('#numero').val('');
        $('#inicio').val('');
        $('#fim').val('');
        $('#valor').val('0,00');
        $('#obs').val('');

        $(".veiculolist").html('');
        $(".results").html('');
        $("#addveiculo").val('');

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
            cliente: $('#cliente').dropdown('get value'),
            numero: $('#numero').val(),
            inicio: $('#inicio').val(),
            fim: $('#fim').val(),
            valor: realToFloat($('#valor').val()),
            obs: $('#obs').val(),
            veiculo: []
        }
       
        // Validações
        if (data.cliente == "0" || data.cliente == null) {
            $("#cliente").focus();
            return report('Selecione um <b>Cliente</b>!', ALERT);
        }

        if (data.numero.trim() == '') {
            $("#numero").focus();
            return report('É obrigatório indicar o <b>Número do Contrato</b>!', ALERT);
        }

        if (data.inicio.trim() == '') {
            $("#inicio").focus();
            return report('Indique a <b>Data de Início</b>!', ALERT);
        }

        if (data.fim.trim() == '') {
            $("#fim").focus();
            return report('Indique a <b>Data de finalização do Contrato</b>!', ALERT);
        }

        // Pegando a lista de veículos
        for(var i in APP_PAGE.veiculos){
            if("undefined" != typeof APP_PAGE.veiculos[i]['id'] && APP_PAGE.veiculos[i].deleted == false){
                data.veiculo.push({id: APP_PAGE.veiculos[i]['id'], valor: parseFloat(APP_PAGE.veiculos[i]['valor'])})
            }
        }
        // Pegando a lista de veículos ADICIONADOS
        for(var i in APP_PAGE.veiculosNew){
            if("undefined" != typeof APP_PAGE.veiculosNew[i]['id']){
                data.veiculo.push({id: APP_PAGE.veiculosNew[i]['id'], valor: parseFloat(APP_PAGE.veiculosNew[i]['valor'])})
            }
        }

        //console.log(data)
        //return false;

        // Enviando
        SERVER.send(APP_PAGE.config.save, data, function(data) {

            if ("undefined" == typeof data['msg']) {
                return report('Não consegui salvar o registro!', ALERT)
            }

            // Enviando arquivos anexados
            SENDFILE.save('contrato', data.id);

            // Resetando os DropDowns
            $('.edit .ui.dropdown').dropdown('restore defaults');

            // atualiza a lista de veículos disponíveis
            APP_PAGE.getVeiculos(); 
            
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

    // Display VEICULOS adicionados no banco de dados
    show: function(){

        // Limpando a listagem ...
        $(".veiculolist").html('');

        // Somando os valores
        APP_PAGE.valor = 0;

        // Criando a listagem de anexado
        APP_PAGE.veiculos.map((a, i)=>{
            if(a.deleted == false) {APP_PAGE.valor += parseFloat(a.valor)}

            $(".veiculolist").append('<div class="item '+(a.deleted == false ? '' : 'deleted')+'"><div class="right floated content"><span>'+floatToReal(a.valor)+'</span>'+(a.deleted == false ? '<button type="button" class="circular ui icon button basic red" data-tooltip="Remover" data-inverted="" data-position="left center" onclick="APP_PAGE.removeVeiculo('+i+')"><i class="trash alternate icon"></i></button>' : '<button type="button" class="circular ui icon button basic green" data-tooltip="Reciclar" data-inverted="" data-position="left center" onclick="APP_PAGE.reciclaVeiculo('+i+')"><i class="undo icon"></i></button>')+'</div><i class="large car middle aligned icon blue" style="padding-top:5px"></i><div class="content bottom aligned" style="padding-top:7px">'+a.title+'</div></div>');            
        })

        // Registrando
        $("#valor").val(floatToReal(APP_PAGE.valor + APP_PAGE.valorNew));        
    },

    // Remover veículo 
    removeVeiculo: function(id){
        APP_PAGE.veiculos[id].deleted = true;
        APP_PAGE.valor = valor - parseFloat(APP_PAGE.veiculos[id].valor);
        APP_PAGE.show();
    },
    // Reciclando veículo
    reciclaVeiculo: function(id){
        APP_PAGE.veiculos[id].deleted = false;
        APP_PAGE.valor = valor + parseFloat(APP_PAGE.veiculos[id].valor);
        APP_PAGE.show();
    },

    // Pegando a listagem de clientes
    getClientes: function(){
        SERVER.send(APP_PAGE.config.clientes, {tipo: "cliente"}, function(data){
            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            
            var op = data.row.map((a) => {
                return '<option value="'+a.id+'">'+a.nome_fantasia+'</option>';
            })
            $("#cliente").html(op);
            //reset semantic-UI
            $('#cliente').dropdown();
        })
    },

    // Pegando listagem de veículo
    getVeiculos: function(){
        //limpando a lista
        APP_PAGE.veiculosSearchData = []; // listagem para busca
        APP_PAGE.veiculosNew = [];        // listagem dos veiculos adicionados
        APP_PAGE.veiculosCarregados = []; // listagem carregada do DB -limpando

        //Pegando lista de veiculos
        SERVER.send(APP_PAGE.config.veiculos, {from: 'contrato'}, function(data){  //console.log('getVeiculos', data); TMP4 = data;
            if("undefined" == typeof data['row']) return false;

            APP_PAGE.veiculosCarregados = data.row; // salva a listagem do BD - veiculos disponíveis

            // Atualizando a busca 
            APP_PAGE.refleshVeiculos();
        });
    },

    refleshVeiculos: function(){
        APP_PAGE.veiculosSearchData = []; // listagem para busca
        // Retirando os que já foram adicionados
        APP_PAGE.veiculosSearchData = APP_PAGE.veiculosCarregados.filter((a)=>{
                var tmp = APP_PAGE.veiculosNew.find((b)=>{
                        if(a.id == b.id) return true;
                        return false;
                    })
                if("undefined" == typeof tmp) { return true } else { return false }
            }) 

        // Limpando o cache
        $('.ui.search.addveiculo').search('clear cache');

        // Criando nova busca
        $('.ui.search.addveiculo').search({
            source: APP_PAGE.veiculosSearchData,
            error : {noResults: 'Não encontrei esse veículo!'},
            onSelect: function (result, response){//console.log('DENTRO:',result, response)
                APP_PAGE.veiculosNew.push({
                    'id': result.id, 
                    'title': result.title, 
                    'valor': result.valor
                });

                // Atualizando na tela
                APP_PAGE.showNew();
            }
        });
    },

    // Removendo um veículo da lista
    removeVeiculoNew: function (id) {
        var tmp = APP_PAGE.veiculosNew.filter((a)=>{ //console.log(a, id)
            if(a.id == id) return false;
            return true;
        })
        APP_PAGE.veiculosNew = tmp;
        APP_PAGE.showNew();
    },

    // Show Files
    showNew: function(){

        // Atualizando lista de busca
        APP_PAGE.refleshVeiculos();

        // Limpando a listagem ...
        $(".veiculolistnew").html('');

        // Reset
        APP_PAGE.valorNew = 0;

        // Criando a listagem de anexado
        APP_PAGE.veiculosNew.map((a, i)=>{

            // Fazendo a soma dos valores
            APP_PAGE.valorNew += parseFloat(a.valor);

            $(".veiculolistnew").append('<div class="item"><div class="right floated content"><span>'+floatToReal(a.valor)+'</span><button type="button" class="ui icon button basic red" data-tooltip="Remover" data-inverted="" data-position="left center" onclick="APP_PAGE.removeVeiculoNew('+a.id+')"><i class="trash alternate icon"></i></button></div><i class="large car middle aligned icon blue" style="padding-top:5px"></i><div class="content bottom aligned" style="padding-top:7px">'+a.title+'</div></div>');            
        })

        // Registrando o valor total
        $("#valor").val(floatToReal(APP_PAGE.valorNew + APP_PAGE.valor));
    }
}

// RUNNING ...
$(document).ready(function(){APP_PAGE.start()})