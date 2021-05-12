/**
 * Cadastro da Empresa e suas filiais
 * 
 */
var TMP4;
APP_PAGE = {

    config: {
        title: 'Ordem de Serviço',

        list: SERVER_URL + '/cadastro/os/search/',
        find: SERVER_URL + '/cadastro/os/find/',
        save: SERVER_URL + '/cadastro/os/save/',
        delete: SERVER_URL + '/cadastro/os/delete/',
        tipoOs: SERVER_URL + '/cadastro/tipo_os/list',
        veiculo: SERVER_URL + '/cadastro/os/veiculo'

    },
    removeFlag: false,


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
            APP_PAGE.display('list');
        })

        // Ativando a barra de ferramentas do cadastro
        $(".topbar").show();

        // Restart semantic-ui resourses
        $('.ui.checkbox').checkbox();

        // Carregando lista de Clientes
        APP_BASE.getClientes();

        // Carregando lista de Clientes
        APP_BASE.getFornecedores();

        // Pegando "tipos de OS"
        APP_PAGE.getTipoOs();        

        // Escutando a troca de CLIENTE
        $("#cliente").on('change', function(){APP_PAGE.getVeiculos()});

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

        //console.log(data); 
        //TMP3 = data;

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
            op += '<option value="' + x + '">' + data.title[x].value + '</option>';
            table += '<th'+APP_PAGE.extraAttr(data.title[x])+'>' + data.title[x].value + '</th>';
        }
        table += '<th></th></tr></thead><tbody>';
        $("#buscar_order").html(op);

        for (var i in data.row) {
            if (i == 'title') {
                continue
            }

            table += '<tr class="table-edit">';
            for (var x in data.row[i]) {
                if (x == 'id' || x == 'deleted') continue;
                table += '<td title="Click para editar" onclick="APP_PAGE.edit(\'' + data.row[i].id + '\')"'+APP_PAGE.extraAttr(data.row[i][x])+'>' + data.row[i][x].value + '</td>';
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

    //Função para capturar atributos extras nos campos
    extraAttr: function(a){
        if(a.length <= 1) return '';        

        attr = '';
        for(var i in a){
            if(i == 'value') continue;
            attr += ' '+i+'="'+a[i]+'"';
        }

        return attr;
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
            SENDFILE.list('os', id);

            // Pegando a listagem de veículos
            APP_PAGE.getVeiculos();

            // Inserindo os dados no formulário
            $('#id').val(data.row.id);
            $('#tipo_os').dropdown('set selected', data.row.tipo_os);
            $('#cliente').dropdown('set selected', data.row.cliente);
            $('#fornecedor').dropdown('set selected', data.row.fornecedor);
            $('#veiculo').dropdown('set selected', data.row.veiculo);
            $('#numero').val(data.row.numero);
            $('#data').val(data.row.data);
            $('#km').val(data.row.km);
            $('#total').val(floatToReal(data.row.total));
            $('#obs').val(data.row.obs);

            $('.notatable tbody').html('');
            data.details.forEach((d)=>{
                APP_PAGE.addRow(false, d);
            })


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

        // Pegando a listagem de veículos
        APP_PAGE.getVeiculos();

        $('#id').val(0);
        $('#tipo_os').dropdown();
        $('#cliente').dropdown();
        $('#fornecedor').dropdown();
        $('#numero').val('');
        $('#data').val('');
        $('#km').val('');
        $('#total').val('0,00');
        $('#obs').val('');

        $('.notatable tbody').html('');
        APP_PAGE.addRow(false);

        // Barra de Título
        $("title").html(APP_PAGE.config.title + ' / Novo')
        $("#toptitle").html(APP_PAGE.config.title + ' / Novo')

        // Visualização
        APP_PAGE.display('edit')
    },

    // SAVE --> para EMPRESA : TODO criar um sistema para todos os outros
    save: function() {

        // Pegando os itens da tabela
        var itens = APP_PAGE.getTableData();

        // Pegando os dados        
        var data = {
            id: $('#id').val(),
            tipo_os: $('#tipo_os').val(),
            cliente: $('#cliente').val(),
            fornecedor: $('#fornecedor').val(),
            veiculo: $('#veiculo').val(),
            numero: $('#numero').val(),
            data: $('#data').val(),
            km: $('#km').val(),
            total: realToFloat($('#total').val()),
            obs: $('#obs').val(),
            detalhes: itens
        }

        
        // Validações
        if(itens.length == 0){
            return report('É necessário indicar os ÍTENS!', ALERT);
        }
        if (data.numero.trim() == '') {
            $("#numero").focus();
            return report('É obrigatório indicar o NÚMERO da OS!', ALERT);
        }
        if (data.data == '') {
            $("#data").focus();
            return report('Me indique a DATA!', ALERT);
        }        
        if (data.total == 0 || isNaN(data.total)) {
            $("#total").focus();
            return report('Qual o VALOR dessa OS?', ALERT);
        }
        if (data.km.trim() == '') {
            $("#km").focus();
            return report('Qual a KILOMETRAGEM do veículo?', ALERT);
        }


        // Enviando
        SERVER.send(APP_PAGE.config.save, data, function(data) {

            if ("undefined" == typeof data['msg']) {
                return report('Não consegui salvar o registro!', ALERT)
            }

            // Enviando arquivos anexados
            SENDFILE.save('os', data.id);

            // ATENÇÃO --> O id é retornado para ser criado uma NOTA, opcionalmente
            // A ser implementado na próxima versão.

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

    // Pegando aos tipo de OS
    getTipoOs: function(){
        SERVER.send(APP_PAGE.config.tipoOs, {}, function(data){

            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)

            TMP = data.row;
            var op = data.row.map((a) => {
                return '<option value="'+a.id+'">'+a.nome+'</option>';
            })
            $("#tipo_os").html(op);
        })
    },

    // Listagem de veículos por cliente
    getVeiculos: function(){
        
        var cliente = $('#cliente').val();
        if(cliente == "" || "undefined" == typeof cliente) return false;

        SERVER.send(APP_PAGE.config.veiculo, {cliente: cliente}, function(data){ 
            var op = data.row.map((a) => {
                return '<option value="'+a.id+'">'+a.title+'</option>';
            })
            $("#veiculo").html(op);
        })
    },

    addRow: function(force, data){ //console.log('ADDROW', APP_PAGE.removeFlag)
        if(APP_PAGE.removeFlag == true){
            APP_PAGE.removeFlag = false;
            if(force !== true) return false;
        }


        var data = data || {descricao:'', quantidade:'', unitario:'0,00',valor:'0,00'};

        $('.notatable tbody').append('<tr><td contenteditable="true" data-name="descricao" class="ntpad">'+data.descricao+'</td>'
                    +'<td contenteditable="true" data-name="quantidade" class="text-right ntpad">'+data.quantidade+'</td>'
                    +'<td data-name="unitario"><input maxlength="15" class="money text-right intable" value="'+data.unitario+'"></td>'
                    +'<td data-name="valor"><input maxlength="15" class="money text-right intable" onfocus="APP_PAGE.soma(this)" onblur="APP_PAGE.somaTotal()" value="'+data.valor+'"></td>'
                    +'<td><button type="button" class="circular ui icon button basic red" data-tooltip="Remover" data-inverted="" data-position="left center" onclick="APP_PAGE.removeRow(this)" onblur="APP_PAGE.addRow()"><i class="trash alternate icon"></i></button></td></tr>');
        $('.money').mask('000.000.000,00', {reverse: true})
        APP_PAGE.somaTotal();
        $('.notatable tbody tr:last-child td:first-child').focus();
    },

    removeRow: function(e){ //console.log('REMOVEROW', APP_PAGE.removeFlag)
        if(document.querySelectorAll('.notatable tbody tr').length <= 1) return false;

        e.parentElement.parentElement.remove();
        APP_PAGE.somaTotal();
        APP_PAGE.removeFlag = true;
    },

    soma: function(e){
        var tr = e.parentElement.parentElement;
        var q = realToFloat(tr.querySelector('td[data-name="quantidade"]').innerHTML);
        var u = realToFloat(tr.querySelector('td[data-name="unitario"]').querySelector('input').value);

        if(isNaN(q) == false && isNaN(u) == false){
            tr.querySelector('td[data-name="valor"]').querySelector('input').value = floatToReal(q*u);
            tr.querySelector('td[data-name="quantidade"]').innerHTML = String(q).replace(/\.| /g,'');
            APP_PAGE.somaTotal();
        }
    },

    somaTotal: function(){
        var it = APP_PAGE.getTableData(true);

        var total = 0;
        it.forEach(function(a){
            total += a.valor;
        })

        $("#total").val(floatToReal(total));
        return total;
    },

    // Pegando os dados da tabela
    getTableData: function(nrep){
        var rep = nrep || false;
        var tb = document.querySelector('.notatable');
        var itens = tb.querySelectorAll('tbody.itens tr');

        var res = [];

        itens.forEach(function(a,idx){ 
        //itens.map((a)=>{
            var b = {
                descricao: a.querySelector('td[data-name="descricao"]').innerHTML,
                quantidade: realToFloat(a.querySelector('td[data-name="quantidade"]').innerHTML),
                unitario: realToFloat(a.querySelector('td[data-name="unitario"]').querySelector('input').value),
                valor: realToFloat(a.querySelector('td[data-name="valor"]').querySelector('input').value),
            };

            if(b['descricao'].trim() == "" 
                && isNaN(b.quantidade) == true 
                && isNaN(b.unitario) == true 
                && isNaN(b.valor) == true){
                if(itens.length > 1) {itens[idx].remove();} //remove somente se não for a única
            } else if(b.descricao.trim() != "" 
                && isNaN(b.quantidade) == false 
                && isNaN(b.unitario) == false 
                && isNaN(b.valor) == false){
                res.push(b);
            } else if(!nrep){
                report('Verifique os campos em destaque!', WARN);
                itens[idx].classList.add('destaque');
                setTimeout(function(){itens[idx].classList.remove('destaque')}, 4000);
            }
        })

        return res;
    },
}

// RUNNING ...
$(document).ready(function(){APP_PAGE.start()})