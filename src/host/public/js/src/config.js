

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

    chat: {
        content: '#chat-content',
        msg: '#chat-msg',
        loader: '#chat-loader',
        text: '#chat-text',
        send: '#chat-send',
        emojiBtn: '#chat-show-emoji',
        emoji: '#chat-emojis',
        msgId: '#chat-msgid',


        chanel: 'qzc',
        url: '/msg/qzm'
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
            bmenu: false
        }, {
            id: 'auth',
            title: 'Login',
            efect: 'up',
            trail: false,
            bmenu: false,
            onShow: () => App.Auth = new _Auth(Config.auth),
            onHide: () => App.Auth = null
        }, {
            id: 'file',
            title: 'File Manager',
            efect: 'backward',
            trail: ['home'],
            bmenu: 'file',
            onShow: () => App.File = new _File(Config.file),
            onHide: () => App.File = null
        }, {
            id: 'chat',
            title: 'Chat',
            efect: 'backward',
            trail: ['index'],
            bmenu: false,
            onShow: () => App.Chat.show(),
            onHide: () => App.Chat.hide()
        }, {
            id: 'profile',
            title: 'Profile',
            efect: 'backward',
            trail: ['home'],
            bmenu: 'profile',
            onShow: () => {
                App.Profile = new _Profile(Config)
                App.Profile.show()
            },
            onHide: () => App.Profile = null
        }, {
            id: 'index',
            title: 'Mensagens',
            efect: 'backward',
            trail: ['home'],
            bmenu: 'msg',
            onShow: () => App.User.index()
        }
    ],

    bmenu: [
        { id: 'file', icon: 'folder', title: 'Arquivos', action: () => App.Page.show('file') },
        { id: 'msg', icon: 'chat', title: 'Mensagens', action: () => App.Page.show('chat') },
        { id: 'profile', icon: 'account_box', title: 'Home', action: () => App.Page.show('profile') },
        { id: 'auth', icon: 'exit_to_app', title: 'Sair', action: () => App.Me.logout() }
    ]
}