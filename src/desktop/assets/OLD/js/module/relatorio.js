/**
 * Relatórios
 * 
 */
APP_RELATORIO = {

    page: {
        index: {
            url: 'html/relatorio/index.html',
            title: 'W5Frota'
        },
        dashboard: {
            url: 'html/relatorio/dashboard.html',
            title: ''
        },
        veiculo: {
            url: 'html/relatorio/veiculo.html'
        },
         nota: {
            url: 'html/relatorio/nota.html'
        },
         sinistro: {
            url: 'html/relatorio/sinistro.html'
        },
         os: {
            url: 'html/relatorio/os.html'
        },
         infracao: {
            url: 'html/relatorio/infracao.html'
        },
         venda: {
            url: 'html/relatorio/venda.html'
        }
    },
    listField: false,
    editField: false,
    list_page_atual: 1,


    init: function() {

        APP_RELATORIO.show();

    },

    // Carrega a página HTML
    show: function() {

        $.get(APP_RELATORIO.page.index.url)
        .done(function(html) {
            $("#body").html(html)
            $("title").html(APP_RELATORIO.page.index.title)
            $("#toptitle").html(APP_RELATORIO.page.index.title)

        }).fail(function(e) {
            report('Não consegui carregar a página!')
        })
    },

    // Carrega formulário
    form: function() {
        $.get(APP_RELATORIO.page[APP_MODULE_PAGE].url)
        .done(function(html) {
            $("#form").html(html)
        }).fail(function(e) {
            report('Não consegui carregar a página!')
        })
    }
}