

// Pages
const Config = {
    app: {
        id: 'electronize',
        version: '0.0.1',
        name: 'Electronize',
        core: 'http://localhost',
        assets: 'http://localhost',
        html: {
            theme: '#themeStyle'
        }
    },

    home: {
        title: '#hom-title'
    },

    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        resetPassword: '/auth/password',
        profile: '/auth/profile',
        update: '/auth/update',
        add: '/auth/add',
        remove: '/auth/remove',
        html: {
            logo: '#aut-logo',
            form: '#aut-form',
            login: '#aut-login',
            password: '#aut-password'
        }
    },

    file: {
        list: 'file/list',
        download: '/file/download',
        html: {
            fileName: '.file-name',
            menu: '#file-menu',
            menuTitle: '#file-menu-title',
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

    user: {
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
        },
        {
            id: 'home',
            title: 'Welcome',
            efect: 'down',
            trail: false,
            bmenu: 'user',
            onShow: () => App.Home.init()
        }, {
            id: 'auth',
            title: 'Login',
            efect: 'up',
            trail: false,
            bmenu: false,
            onShow: () => App.Auth.show()
        }, {
            id: 'file',
            title: 'File Manager',
            efect: 'backward',
            trail: ['home'],
            bmenu: 'file',
            onShow: () => App.File.show()
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
            bmenu: 'user',
            onShow: () => App.User.show()
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
        { id: 'user', icon: 'account_box', title: 'Home', action: () => App.Page.show('profile') },
        { id: 'auth', icon: 'exit_to_app', title: 'Sair', action: () => App.Auth.logout() }
    ]
}