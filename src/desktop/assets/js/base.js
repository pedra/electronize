/**
 * Cadastro da Empresa e suas filiais
 * 
 */
APP_BASE = {

    config: {

        veiculos: SERVER_URL + '/cadastro/veiculo/list',
        empresas: SERVER_URL + '/cadastro/empresa/list',

    },


     // Pegando a listagem de veiculos
    getVeiculos: function(unSelected){

        var unSelected = unSelected || false;

        SERVER.send(APP_BASE.config.veiculos, {}, function(data){

            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            
            var op = data.row.map((a) => {
                return '<option value="'+a.id+'">'+a.placa+'</option>';
            })
            if(unSelected) {
                op = '<option value="0" selected>Selecione...</option>'+op;
            }
            $("#veiculo").html(op);
        })
    },

     // Pegando a listagem de clientes
    getClientes: function(unSelected){

        var unSelected = unSelected || false;

        SERVER.send(APP_BASE.config.empresas, {tipo: "cliente"}, function(data){

            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            
            var op = data.row.map((a) => {
                return '<option value="'+a.id+'">'+a.nome_fantasia+'</option>';
            })
            if(unSelected) {
                op = '<option value="0" selected>Selecione...</option>'+op;
            }
            $("#cliente").html(op);
        })
    },

 // Pegando a listagem de Seguradora
    getSeguradoras: function(unSelected){

        var unSelected = unSelected || false;

        SERVER.send(APP_BASE.config.empresas, {tipo: "seguradora"}, function(data){

            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            
            var op = data.row.map((a) => {
                return '<option value="'+a.id+'">'+a.nome_fantasia+'</option>';
            })
            if(unSelected) {
                op = '<option value="0" selected>Selecione...</option>'+op;
            }
            $("#seguradora").html(op);
        })
    },

    // Pegando a listagem de Concessionaria
    getConcessionarias: function(unSelected){

        var unSelected = unSelected || false;

        SERVER.send(APP_BASE.config.empresas, {tipo: "concessionaria"}, function(data){

            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            
            var op = data.row.map((a) => {
                return '<option value="'+a.id+'">'+a.nome_fantasia+'</option>';
            })
            if(unSelected) {
                op = '<option value="0" selected>Selecione...</option>'+op;
            }
            $("#concessionaria").html(op);
        })
    },

    // Pegando a listagem de Fornecedor
    getFornecedores: function(unSelected){

        var unSelected = unSelected || false;

        SERVER.send(APP_BASE.config.empresas, {tipo: "fornecedor"}, function(data){

            if("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)
            
            var op = data.row.map((a) => {
                return '<option value="'+a.id+'">'+a.nome_fantasia+'</option>';
            })
            if(unSelected) {
                op = '<option value="0" selected>Selecione...</option>'+op;
            }
            $("#fornecedor").html(op);
        })
    }





}


