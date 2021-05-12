/** 
 * Envia arquivos ao servidor
 */

//var request = require('request')
var fs = require('fs')
var { dialog } = require('electron').remote

let SENDFILE = {

    noAdd: false,
    file: [],
    anexado: [],
    saveUrl: SERVER_URL + '/file2/save',
    listUrl: SERVER_URL + '/file2/list',
    deleteUrl: SERVER_URL + '/file2/delete',
    downloadUrl: SERVER_URL + '/file2/download',

    // Remove arquivo
    remove: function (id) {
        if ("undefined" != typeof SENDFILE.anexado[id]) {
            SENDFILE.anexado.splice(id, 1); // Retira um arquivo da lista
            SENDFILE.show(); // atualiza a listagem
        }
    },

    // Limpa todas as entradas
    clear: function () {
        // Limpando listagem dos anexados
        $(".file .file_attached").html('');

        // Limpando a listagens dos inseridos localmente
        SENDFILE.anexado = [];
        SENDFILE.show();
    },

    // Adiciona arquivos 
    add: function (e) {
        var f = e.target;

        // Caso o elemento só lista - não adiciona novos arquivos
        if (SENDFILE.noAdd == true) {
            f.type = 'hidden'
            return false;
        } else {
            f.type = 'file'
        }

        //var anexado = [];
        var n = SENDFILE.anexado.length;
        for (var i in f.files) {
            if ("undefined" == typeof f.files[i].path) continue;
            if (f.files[i].size > 5000000) {
                report('Arquivo <b>muito grande</b>!<br>' + f.files[i].path, WARN, null, 7000);
                continue;
            }
            SENDFILE.anexado[n] = f.files[i].path;
            n++;
        }

        f.value = null; // pega a referencia dos anexados no input->file
        return SENDFILE.show(); // show file list

    },

    // Show Files
    show: function () {

        // Limpando a listagem ...
        $(".file .file_results").html('');

        // Criando a listagem de anexado
        SENDFILE.anexado.map((a, i) => {
            $(".file .file_results").append('<div class="item"><div class="right floated content"><button type="button" class="circular ui icon button basic red" data-tooltip="Remover" data-inverted="" data-position="left center" onclick="SENDFILE.remove(' + i + ')"><i class="trash alternate icon"></i></button></div><i class="large file alternate middle aligned icon blue" style="padding-top:5px"></i><div class="content bottom aligned" style="padding-top:7px">' + a + '</div></div>');
        })
    },

    // Listagem dos arquivos por TABELA/ID
    list: function (tabela, id, erasable) {
        // Busca lista de arquivos no servidor...
        SERVER.send(SENDFILE.listUrl, { tabela: tabela, tabela_id: id }, function (data) {
            if ("undefined" == typeof data['error'] || data.error !== false) {
                return false; // Se não tiver arquivos para esse registro...
            } else {
                SENDFILE.file = data.row; // Salva os arquivos no objeto
                return SENDFILE.showFile(erasable); // monta a listagem na tela
            }
        })
    },

    // mostra a listagem dos arquivos no servidor
    showFile: function (erasable) {
        // Limpando a listagem...           
        $(".file .file_attached").html('');

        // Criando a listagem de arquivos
        SENDFILE.file.map((a, id) => {
            $(".file .file_attached").append('<div class="item"><div class="right floated content"><button type="button" class="circular ui icon button basic green" data-tooltip="Baixar" data-inverted="" data-position="left center" onclick="SENDFILE.download(' + id + ')"><i class="download icon"></i></button>' + (erasable == false ? '' : '<button type="button" class="circular ui icon button basic red" data-tooltip="Excluir" data-inverted="" data-position="top right" onclick="SENDFILE.delete(' + id + ')"><i class="trash alternate icon"></i></button>') + '</div><i class="large file alternate middle aligned icon blue" style="padding-top:5px"></i><div class="content bottom aligned" style="padding-top:7px">' + a.nome + '</div></div>');
        });
    },

    // Delete do servidor
    delete: function (id) {
        // Deletando no servidor...
        SERVER.send(SENDFILE.deleteUrl, { id: SENDFILE.file[id].id, nome: SENDFILE.file[id].nome }, function (data) {
            report(data.msg);
            if (!data.error) {
                delete SENDFILE.file[id];
            }
            SENDFILE.showFile();
        });
    },

    // Download do arquivo
    download: function (id) {

        var download = { file: '' };
        dialog.showSaveDialog({ defaultPath: SENDFILE.file[id].nome }, function (file) {

            $("#filesenddownloadstatus").fadeIn(1000).html('');

            // Barra de download
            $("#filesenddownloadstatus").html('<div class="ui tiny indicating progress" data-percent="0" id="sendfiledownload"><div class="bar"></div><div class="label">Baixando arquivo...</div></div>');

            // Faz o download do arquivo...
            SENDFILE.downloadFile({
                remoteFile: SENDFILE.downloadUrl + '/' + SENDFILE.file[id].id,
                localFile: file,
                onProgress: function (rec, total) {
                    var p = (rec * 100) / total;
                    $('#sendfiledownload').progress({ percent: p });
                }
            }).then(function () {
                report('Arquivo baixado com sucesso!', INFO)
                $("#filesenddownloadstatus").fadeOut(1000).html('');
            });
        })
    },

    // Download file by STREAM
    downloadFile: function (configuration) {
        // return new Promise(function(resolve, reject){
        //     // Save variable to know progress
        //     var received_bytes = 0;
        //     var total_bytes = 0;            

        //     var req = request({
        //         method: 'GET',
        //         uri: configuration.remoteFile
        //     });

        //     var out = fs.createWriteStream(configuration.localFile);
        //     req.pipe(out);

        //     req.on('response', function ( data ) {
        //         // Change the total bytes value to get progress later.
        //         total_bytes = parseInt(data.headers['content-length' ]);
        //     });

        //     // Get progress if callback exists
        //     if(configuration.hasOwnProperty("onProgress")){
        //         req.on('data', function(chunk) {
        //             // Update the received bytes
        //             received_bytes += chunk.length;
        //             configuration.onProgress(received_bytes, total_bytes);
        //         });
        //     }else{
        //         req.on('data', function(chunk) {
        //             // Update the received bytes
        //             received_bytes += chunk.length;
        //         });
        //     }

        //     req.on('end', function() {
        //         resolve();
        //     });
        // });
    },

    // Preparando e enviando arquivos anexos
    save: function (tabela, tabela_id) {
        if (!tabela || !tabela_id) return false;

        // Varrendo os arquivos e processando
        SENDFILE.anexado.map(arquivo => {

            var data = {
                name: arquivo.replace(/\\/g, '/').split('/').pop(),
                ext: arquivo.split('.').pop(),
                tabela: tabela,
                tabela_id: tabela_id
            }
            console.log('FORA', data)

            fs.readFile(arquivo, function (e, f) {
                console.log('DENTRO', f, data, arquivo)
                // Converte em base64
                var bf = new Buffer(f, 'binary').toString('base64')

                // Enviando o arquivo ...
                SERVER.send(SENDFILE.saveUrl, data, function (dt) {
                    if (dt == false || dt.error == true || "undefined" == typeof dt['msg']) {
                        report('Não consegui enviar o arquivo<br>' + data[i].name + '!!<br>Tente novamente, mais tarde.', ALERT, null, 7000)
                    } else {
                        report(dt.msg, INFO, null, 10000);
                    }
                }, bf);
            })
        })

        // Limpando a listagem de anexado
        SENDFILE.anexado = [];
        SENDFILE.show();
    }
}