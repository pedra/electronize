/**
 * Notificações
 * 
 */
APP_NOTIFICACAO = {

    page: {
        title: 'Notificação',
        index: {
            url: 'html/notificacao/index.html',
            title: 'W5Frota'
        },
        dashboard: {
            url: 'html/notificacao/dashboard.html',
            title: ''
        },
        infracao: {
            url: 'html/notificacao/infracao.html'
        }
    },
    listField: false,
    editField: false,
    list_page_atual: 1,


    init: function() {

        APP_NOTIFICACAO.show();

    },

    // Carrega a página HTML
    show: function() {

        $.get(APP_NOTIFICACAO.page.index.url)
        .done(function(html) {
            $("#body").html(html)
            $("title").html(APP_NOTIFICACAO.page.index.title)
            $("#toptitle").html(APP_NOTIFICACAO.page.index.title)

        }).fail(function(e) {
            report('Não consegui carregar a página!')
        })
    },

    // Carrega formulário
    form: function() {
        $.get(APP_NOTIFICACAO.page[APP_MODULE_PAGE].url)
        .done(function(html) {
            $("#form").html(html)
        }).fail(function(e) {
            report('Não consegui carregar a página!')
        })
    }
}