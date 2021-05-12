// Controle de versão - modificar conforme a versão, para upload no usuário
const versionname = 'W5Frota';
const versionbuild = '1811220350';
const version = '0.6.1';

// Acionando o ContextMenu
const {remote} = require('electron')
const {Menu, MenuItem} = remote


window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    // var contextMenu = Menu.getApplicationMenu().items.filter(function(item){
    //   return item.label == "Edit";
    // })[0].submenu;

    const contextMenu = Menu.buildFromTemplate([{
        label: 'Desfazer',
        role: 'undo',
    }, {
        label: 'Refazer',
        role: 'redo',
    }, {
        type: 'separator',
    }, {
        label: 'Cortar',
        role: 'cut',
    }, {
        label: 'Copiar',
        role: 'copy',
    }, {
        label: 'Colar',
        role: 'paste',
    }, {
        type: 'separator',
    }, {
        label: 'Selecionar tudo',
        role: 'selectall',
    },
    ]);
    
    let node = e.target;

    while (node) {
        if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            contextMenu.popup(remote.getCurrentWindow());
            break;
        }
        node = node.parentNode;
    }

}, false);

// Low-DB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('config.json')
const db = low(adapter)
const shell = require('electron').shell;

// IPC (comunicação com a base "main.js")
const {ipcRenderer} = require('electron')

// Variáveis da Aplicação
const APP_MODULE = {
    cadastro: APP_CADASTRO,
    lancamento: APP_LANCAMENTO,
    relatorio: APP_RELATORIO,
    notificacao: APP_NOTIFICACAO
}
let APP_MODULE_ID = 'cadastro'
let APP_MODULE_PAGE = 'dashboard'

// debug only - delete-me after...
let TMP1 = []
let TMP2 = ''
let TMP3 = ''


// START Application
window.onload = () => {

    // Start MENU principal da aplicação
    APP_MENU.init();
    
    // Checando login
    APP_LOGIN.init(); 

    // Botão de FECHAR a JANELA
    $('#topclose').on('click', () => { ipcRenderer.send('fechar') })

    // Botão de MAXIMIZAR a JANELA
    $('#topmax').on('click', () => { ipcRenderer.send('maximize') })

    // Logout
    ipcRenderer.on('logout', () => { APP_LOGIN.logout() })

    // Modal message to APP_PAGE
    ipcRenderer.on('modalMsg', function(e, a, b, c){
        if("function" == typeof APP_PAGE['modalMsg']){
            APP_PAGE.modalMsg(e, a, b, c);
        }
    })




    // AUTO UPDATE ---- teste
    ipcRenderer.on('message', (e, t) => console.log(e, t))





    // Change menu - notification
    $("#topbell").on('click', () => {
            $("#topmenu").removeClass('on')
            $("#topbell").addClass('on')
            //$("#topbell a").hide();
            $("#menu").fadeOut(0, () => {$("#notification").fadeIn('slow')
        })   
    })
    $("#topmenu").on('click', () => {
            $("#topmenu").addClass('on')
            $("#topbell").removeClass('on')
            //$("#topbell a").hide();
            $("#notification").fadeOut(0, () => {$("#menu").fadeIn('slow')
            //$("#notification").html('<span class="default">Você não tem novas notificações!<i class="bell slash outline icon"></i></span>')
        })   
    })

    // Acendendo "blackout" & mostrando o "corpo"
    _('blackout').style.display = 'none';

    // Ouvindo o redimensionamento da tela
    document.body.onresize = () => {
        if(!APP_LOGIN.logged) {return false}

        if(document.body.offsetWidth > 800){ 
            APP_MENU.show() 
        } else { 
            APP_MENU.hide()
        }
    }

    // Abrir e fechar o menu ao clicar no logo
    _('logo').onclick = () => {
        if(!APP_LOGIN.logged) {return false}
        APP_MENU.toggle()
    }
}

// Gerencia menu 
const APP_MENU = {

    status: 'hide',

    init: () => { 

        // Atualiza a versão do software
        $("#appinfo").html('<b>'+versionname+'</b> - build '+versionbuild+'/'+version);

        // Inicia o Accordion para o menu do Semantic-ui
        $('.ui.accordion').accordion();

        // Click no MENU
        let menu = document.querySelectorAll('#mmenu .title')
        for (var i = 0; i < menu.length; i++) {
            menu[i].onclick = (e) => {

                // Identificando o módulo
                APP_MODULE_PAGE = 'dashboard';
                APP_MODULE_ID = e.target.getAttribute('data-module');

                // Resetando o submenu dos módulos
                var s = document.querySelector('.submenu li.active');
                if ("undefined" != typeof s && null != s) s.classList.remove('active');

                // Carregando e ropdando os recursos do módulo
                APP_MODULE[APP_MODULE_ID].init();
                APP_MODULE[APP_MODULE_ID].form(APP_MODULE_PAGE);
            }
        }

        // Click no submenu
        let submenu = document.querySelectorAll('.submenu li');
        for (var i = 0; i < submenu.length; i++) {
            submenu[i].onclick = (e) => {

                // Resetando o submenu ACTIVE
                var s = document.querySelector('.submenu li.active');
                if ("undefined" != typeof s && null != s) s.classList.remove('active');

                // Ativando o submenu clicado
                e.target.classList.add('active');

                // Setando as variáveis da APP
                APP_MODULE_PAGE = e.target.getAttribute('data-page');
                APP_MODULE_ID = e.target.getAttribute('data-module');

                // Carregando módulo e form conforme seleção
                APP_MODULE[APP_MODULE_ID].init();
                APP_MODULE[APP_MODULE_ID].form(APP_MODULE_PAGE); 

                // Escondendo o menu, se necessário
                if(APP_MENU.status == 'float') APP_MENU.hide()
            }
        }
    }, 
    hide: () => { 
        _('mmenu').classList.remove('on')
        _('mmenu').classList.remove('float')
        _('body').classList.add('on')
        APP_MENU.status = 'hide'        
    },
    show: () => { 
        if(document.body.offsetWidth > 800) {
            _('mmenu').classList.add('on')
            _('mmenu').classList.remove('float')
            _('body').classList.remove('on')
            APP_MENU.status = 'show'
        } else {
            _('mmenu').classList.add('on');
            _('mmenu').classList.add('float');
            APP_MENU.status = 'float'
        }
    },
    toggle: () => { 
        if(APP_MENU.status == 'show' || APP_MENU.status == 'float'){
            APP_MENU.hide();
        } else {
            APP_MENU.show();
        }
    }
}


// Login ...
const APP_LOGIN = {

    logged: false, 

    securityUrl: 'html/security.html',

    init: () => {

        // Pegando a configuração de usuário do sistema
        var user = db.get('user').value();

        if("undefined" == typeof user){
            user = {
                    "auto": true,
                    "id": 0,
                    "life": 0,
                    "name": "",
                    "token": "",
                    "datein": 0,
                    "logged": false
                }
            db.set('user', user).write();
        }

        // Verificando se está logado.
        if(user.id == 0 || user.token == '' || user.logged == false || (new Date(user.life)) < (new Date) ){
            APP_LOGIN.logout();            
        } else {
            // Roda a aplicação
            APP_LOGIN.startApp();
        }
    },

    logout: function(quiet){
        var quiet = quiet || false;

        APP_LOGIN.logged = false;

        // Logout no servidor
        if(quiet === false){
            SERVER.send(SERVER_URL_LOGOUT, {id: db.get('user').value().id, log: 'logout'});
        }

        // Apaga a configuração (file ".frota")
        db.set('user', {
                auto: true,
                id: 0,
                life: 0,
                name: "",
                token: "",
                datein: 0,
                logged: false
            }).write();

        // Carrega a tela de segurança
        $.get(APP_LOGIN.securityUrl).done(function(html){

            $("#body").html(html)
            $("title").html('Controle de Frota :: Login')
            $("#toptitle").html('')
            $("#loginsobre").html('<b>'+versionname+'</b> - build '+versionbuild+'/'+version)

            APP_MENU.hide(); // esconde o menu

            // Escutando o botão de login
            $('#formlogin').on('submit', function(e){
                e.preventDefault();
                $("#btlogin").addClass('loading');

                // Call login...
                APP_LOGIN.login();
            })

            document.body.style.display = 'block';
        })
    },

    startApp: () => {

        // Status
        APP_LOGIN.logged = true;
        
        // Inicializa SERVER (configuração armazenada no 'user')
        var u = db.get('user').value();
        SERVER.init(u.token, u.id);        

        // Carrega página inicial do módulo ...
        APP_MODULE[APP_MODULE_ID].init();
        APP_MODULE[APP_MODULE_ID].form();

        document.body.style.display = 'block';

        // Show menu ...
        APP_MENU.show();
    },

    // Checa o login e senha e obtem o TOKEN para comunicações posteriores
    login: () => {

        // Obtendo a chave publica do servidor
        $.get(SERVER_URL_RSAKEY).done(function(data) {

            if ("undefined" != data.key) {
                SERVER.RSA = data.key;
            
                // Gerando uma chave aleatória para AES
                SERVER.KEY = rpass(20);

                var loginData = JSON.stringify({
                    login: $("#login").val(),
                    passw: $("#passw").val(),
                    token: SERVER.KEY
                })

                // Criptografando com RSA
                var cripto = RSA.encrypt(loginData, RSA.getPublicKey(SERVER.RSA));

                // Checando login x senha
                $.post(SERVER_URL_LOGIN, {
                        data: cripto
                    })
                    .done(function(data) {

                        if ("undefined" != typeof data.error) {
                            if (data.error == true) {
                                $("#btlogin").removeClass('loading');
                                return report('Seu login ou senha estão incorretos!', ALERT);
                            }

                            // decriptando
                            AES.size(256);
                            var dt = AES.dec(data.data, SERVER.KEY);

                            if (!dt) {
                                $("#btlogin").removeClass('loading');
                                return report('Seu login ou senha estão incorretos!', ALERT);
                            }

                            // decodificando string para json
                            var user = JSON.parse(dt);

                            // Salvando "auto login"
                            //user.auto = _('autologin').checked;

                            // Salvar login
                            user.datein = (new Date).getTime();
                            user.logged = true;

                            db.set('user', user).write();

                            // Roda a aplicação
                            APP_LOGIN.startApp();

                        } else {
                            $("#btlogin").removeClass('loading');
                            return report('Não consegui me conectar com o servidor!<br>Verifique se está conectado à internet.', ALERT);
                        }
                    })
                    .fail(function(e) {
                        $("#btlogin").removeClass('loading');
                        report('Não consegui me conectar com o servidor!<br>Verifique se está conectado à internet.', ALERT);
                    })

            } else {
                $("#btlogin").removeClass('loading');
                report('Algo inexperado ocorreu e não pude carregar a chave do servidor.<br>Verifique sua conexão de internet.', ALERT);
            }

        }).fail(() => {
            $("#btlogin").removeClass('loading');
            report('Algo inexperado ocorreu e não pude me conectar ao servidor.', ALERT);
        })        
    }
}


// PROXY para transporte criptografado com o servidor 
const SERVER = {
    RSA: '',
    KEY: '',
    ID: 0,
    URL: '',
    WDOG: false,
    PING_TIMER: 0,
    LEDBLINK: false,

    init: function(token, id) {
        SERVER.KEY = token;
        SERVER.ID = id;

        // Starts a server WDOG to ping in server (for sincronizes)
        SERVER.WDOG = setInterval(() => {
            SERVER.watchdog()
        }, 1000);
    },

    // Interrupção à cada 1 segundo - para "acordar" funções periódicas
    watchdog: () => {

        ////console.log('[WATCH DOG]');

        // -------------------- Ping
        SERVER.PING_TIMER++;

        if (SERVER.PING_TIMER == 30) {
            SERVER.PING_TIMER = 0;

            // Se NÃO estiver logado, sai sem fazer nada.
            if(APP_LOGIN.logged === false) return false;
            
            // Roda "ping"!
            SERVER.ping();
        }

        // --- Others counters
    },


    // Para transportar dados criptografados com o servidor
    // param = dado a ser transferido sem criptografia
    //      ex.: param ==> {base: dataBase} 
    send: function(url, data, callback, param) {
        TMP2 = data;

        SERVER.led(true); // Start LED INDICATOR

        AES.size(256);
        var data = AES.enc(JSON.stringify(data), SERVER.KEY);
        var data = {
            data: data,
            id: SERVER.ID
        };

        // Para enviar dados não criptografados
        if(param){
            data['param'] = param;
        }

        // Enviando via POST
        $.post(url, data).done(function(dta) {
            
            TMP = dta; // To debug
            
            try {

                // Decriptando
                var dec = AES.dec(dta.data, SERVER.KEY);
                
                // Recuperando objeto JSON
                var dt  = JSON.parse(dec);

            } catch (e) {

                // Ocorrendo um erro, resulta em [false]
                dt = false
            }
         
            TMP1 = dt; // To debug

            // Se a chave não conseguir decodificar, força o logout
            if (!dt) {
                setTimeout(() => {APP_LOGIN.logout(true)}, 1000);
                SERVER.led(false); // Start LED INDICATOR
                return report('Violação de segurança!<br>Para manter a segurança refaça seu LOGIN.');
            }

            // Zerando o PING
            SERVER.PING_TIMER = 0;

            // Se a chave foi alterada no servidor, atualiza o local.
            if (SERVER.KEY !== dt.key) {
                SERVER.KEY = dt.key;
                var user = db.get('user').value();
                user.token = dt.key;
                db.set('user', user).write();
            }

            delete dt.key; // Apaga a key dos dados recebidos
            SERVER.led(false); // Start LED INDICATOR

            // Retorna pelo CallBACK ou pela chamada a função (uma promisse)
            if ("function" == typeof callback) {                
                return callback(dt, dta.extra, dec);
            }            

        }).fail(function(e) {
            SERVER.led(false); // Start LED INDICATOR
            //console.log('[FAIL]:', e, data);
            report('Não consegui me comunicar com o servidor de dados!<br>Verifique a conexão de internet.')
        })
    },

    // Checa se o servidor está acessível
    ping: () => {

        SERVER.led(true); // Start LED INDICATOR

        AES.size(256);
        var data = AES.enc(JSON.stringify({
            key: SERVER.KEY,
            id: SERVER.ID,
            version: version,
            versionname: versionname,
            versionbuild: versionbuild
        }), SERVER.KEY);
        var data = {
            data: data,
            id: SERVER.ID
        };

        $.post(SERVER_URL_PING, data).done(function(dt) {

            try {
                var dt = JSON.parse(AES.dec(dt.data, SERVER.KEY))
            } catch (e) {
                dt = false
            }

            if (!dt || "undefined" == typeof dt[0] || "undefined" == typeof dt[0]['key']) {

                setTimeout(() => {APP_LOGIN.logout()}, 2000);

                SERVER.led(false); // Start LED INDICATOR
                return //console.log('[' + (new Date).toLocaleString() + '] Sincronização falhou!!')
            }

            dt = dt[0];

            // Se a chave foi alterada no servidor, atualiza o local.
            if (SERVER.KEY !== dt.key) {
                SERVER.KEY = dt.key;
                var user = db.get('user').value();
                user.token = dt.key;
                db.set('user', user).write();
            }

            // Para verificar as notificações ...
            APP_INFO.push(dt);

            SERVER.led(false); // Start LED INDICATOR  

        }).fail(function(e) {
            SERVER.led(false); // Start LED INDICATOR
            //console.log('[' + (new Date).getTime().toLocaleString() + '] Sincronização falhou, com erro: ', e);
        })
    },

    // Sinalização de acesso à rede
    led: function(status) {
        var status = status || false;
        clearInterval(SERVER.LEDBLINK);

        if (status == false) {
            $("#topconnect").removeClass('on');
        } else {
            SERVER.LEDBLINK = setInterval(() => {
                $("#topconnect").toggleClass('on')
            }, 100);
        }
    },

    // Open external link in default browser
    openLink: function(link) {
        shell.openExternal(link);
    }
}