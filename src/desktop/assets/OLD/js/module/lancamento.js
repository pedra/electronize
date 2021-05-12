/**
 * Lançamentos
 * 
 */
APP_LANCAMENTO = {

    page: {
        index: {
            url: 'html/lancamento/index.html',
            title: 'W5Frota'
        },
        dashboard: {
            url: 'html/lancamento/dashboard.html',
            title: ''
        },
         veiculo_historico: {
            url: 'html/lancamento/veiculo_historico.html'
        },
         contrato: {
            url: 'html/lancamento/contrato.html'
        },
         sinistro: {
            url: 'html/lancamento/sinistro.html'
        },
         infracao: {
            url: 'html/lancamento/infracao.html'
        },
         os: {
            url: 'html/lancamento/os.html'
        },
         venda: {
            url: 'html/lancamento/venda.html'
        },
         nota: {
            url: 'html/lancamento/nota.html'
        }
    },
    template: {
        relatorio: 'html/print/relatorio.html'
    },
    listField: false,
    editField: false,
    list_page_atual: 1,


    init: function() {

        APP_LANCAMENTO.show();

    },

    // Carrega a página HTML
    show: function() {

        $.get(APP_LANCAMENTO.page.index.url)
        .done(function(html) {
            $("#body").html(html)
            $("title").html(APP_LANCAMENTO.page.index.title)
            $("#toptitle").html(APP_LANCAMENTO.page.index.title)

        }).fail(function(e) {
            report('Não consegui carregar a página!')
        })
    },

    // Carrega formulário
    form: function() {
        $.get(APP_LANCAMENTO.page[APP_MODULE_PAGE].url)
            .done(function(html) {
                $("#form").html(html)
            }).fail(function(e) {
                report('Não consegui carregar a página!')
            })
    }
}