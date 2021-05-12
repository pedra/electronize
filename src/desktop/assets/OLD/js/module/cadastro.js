/**
 * Cadastros
 * 
 */
APP_CADASTRO = {

    page: {
        index: {
            url: 'html/cadastro/index.html',
            title: 'W5Frota'
        },
        dashboard: {
            url: 'html/cadastro/dashboard.html',
            title: ''
        },
        usuario: {
            url: 'html/cadastro/usuario.html'
        },
        empresa: {
            url: 'html/cadastro/empresa.html',
            title: 'Cadastro da Empresa',
            tipo: 'empresa'
        },
        seguradora: {
            url: 'html/cadastro/empresa.html',
            title: 'Cadastro de Seguradora',
            tipo: 'seguradora'
        },
        cliente: {
            url: 'html/cadastro/empresa.html',
            title: 'Cadastro de Cliente',
            tipo: 'cliente'
        },
        concessionaria: {
            url: 'html/cadastro/empresa.html',
            title: 'Cadastro de Concessionária',
            tipo: 'concessionaria'
        },
        fornecedor: {
            url: 'html/cadastro/empresa.html',
            title: 'Cadastro de Fornecedor',
            tipo: 'fornecedor'
        },
        fabricante: {
            url: 'html/cadastro/fabricante.html',
            title: 'Cadastro de Fabricante de Veículo'
        },
        veiculo: {
            url: 'html/cadastro/veiculo.html'
        },
        tipo_infracao: {
            url: 'html/cadastro/tipo_infracao.html'
        },
        status_infracao: {
            url: 'html/cadastro/status_infracao.html'
        },
        tipo_nota: {
            url: 'html/cadastro/tipo_nota.html'
        },
        tipo_os: {
            url: 'html/cadastro/tipo_os.html'
        },
        item: {
            url: 'html/cadastro/item.html'
        },
        veiculo_historico_acao: {
            url: 'html/cadastro/veiculo_historico_acao.html'
        } 
    },
    listField: false, // referencia para a seção de listagem de cadastro
    editField: false, // referencia para a seção de formulário de cadastro
    list_page_atual: 1,


    init: function() { 

        APP_CADASTRO.show(); // carrega o módulo
    },

    // Carrega a página HTML do MÓDULO
    show: function() { 

        $.get(APP_CADASTRO.page.index.url)
        .done(function(html) { 
            $("#body").html(html)
            $("title").html(APP_CADASTRO.page.index.title)
            $("#toptitle").html(APP_CADASTRO.page.index.title)

        }).fail(function(e) {
            report('Não consegui carregar a página!')
        })
    },

    // Carrega a partição de HTML (página)
    form: function() {
        $.get(APP_CADASTRO.page[APP_MODULE_PAGE].url)
        .done(function(html) {// Carrega o HTML ...
            $("#form").html(html)
        }).fail(function(e) {
            report('Não consegui carregar a página!') 
        })
    }
}