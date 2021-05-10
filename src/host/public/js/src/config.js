

// Pages
const Config = {
    app: {
        id: 'electronize',
        version: '0.0.1',
        name: 'Electronize',
        core: 'http://localhost',
        assets: 'http://localhost',
        html: {
            themestyle: '#themeStyle'
        }
    },

    user: {
        url: {
            login: '/auth/login',
            logout: '/auth/logout',
        }
    },

    auth: {
        html: {
            logo: '#aut-logo',
            form: '#aut-form',
            login: '#aut-login',
            password: '#aut-password'
        }
    },

    file: {
        url: {
            list: 'file/list',
            download: '/file/download'
        },
        html: {
            fileName: '.file-name',
            menu: '#file-menu',
            menuTitle: '#file-menu-title',
            breadcrumbs: '#file-breadcrumbs',
            list: '#file-list',

        }
    },

    notify: {
        url: {
            list: '/msg/list'
        },
        html: {
            container: '.page.notify .container',
            card: '.ntf-card',
            cardId: '#ntf-card-'

        }
    },

    chat: {
        url: {
            chanel: 'qzc',
            url: '/msg/qzm'
        },
        html: {
            content: '#chat-content',
            msg: '#chat-msg',
            loader: '#chat-loader',
            text: '#chat-text',
            send: '#chat-send',
            emojiBtn: '#chat-show-emoji',
            emoji: '#chat-emojis',
            msgId: '#chat-msgid'
        }
    },

    profile: {
        setTheme: '/user/theme',
        html: {
            name: '#pfl-name',
            avatar: '#pfl-avatar',
            theme: '#pfl-theme',
            access: '#pfl-status-access',
            download: '#pfl-status-download',
            upload: '#pfl-status-upload'
        }
    },

    pages: [
        {
            id: 'empty',
            title: 'Electronize',
            efect: 'down',
            trail: false,
            bmenu: false,
            auth: false
        }, {
            id: 'auth',
            title: 'Login',
            efect: 'up',
            trail: false,
            bmenu: false,
            auth: false,
            onShow: () => App.Auth = new _Auth(Config.auth),
            onHide: () => App.Auth = null
        }, {
            id: 'file',
            title: 'File Manager',
            efect: 'backward',
            trail: ['home'],
            bmenu: 'file',
            auth: true,
            onShow: () => App.File = new _File(Config.file),
            onHide: () => App.File = null
        }, {
            id: 'chat',
            title: 'Chat',
            efect: 'backward',
            trail: ['index'],
            bmenu: false,
            auth: true,
            onShow: (id) => App.Chat.show(id),
            onHide: () => App.Chat.hide()
        }, {
            id: 'profile',
            title: 'Profile',
            efect: 'backward',
            trail: ['home'],
            bmenu: 'profile',
            auth: true,
            onShow: () => App.Profile = new _Profile(Config),
            onHide: () => App.Profile = null
        }, {
            id: 'notify',
            title: 'Mensagens',
            efect: 'backward',
            trail: ['home'],
            bmenu: 'msg',
            auth: true,
            onShow: () => App.Notify = new _Notify(Config.notify),
            onHide: () => App.Notify = null
        }
    ],

    bmenu: [
        { id: 'file', icon: 'folder', title: 'Arquivos', action: () => App.Page.show('file') },
        { id: 'msg', icon: 'chat', title: 'Mensagens', action: () => App.Page.show('notify') },
        { id: 'profile', icon: 'account_box', title: 'Home', action: () => App.Page.show('profile') },
        { id: 'auth', icon: 'exit_to_app', title: 'Sair', action: () => App.Me.logout() }
    ]
}