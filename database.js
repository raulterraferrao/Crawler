var Firebird = require('node-firebird-dev');
const fs = require('fs');
const writeStream = fs.createWriteStream('produto.json');
const pathName = writeStream.path;

var options = {};

    // default when creating database
options.user = 'sysdba';
options.password = 'sbofutura';
options.database = '/home/raul/Development/Flutter/Crawler/Crawler/dados.fdb'; 

Firebird.attach(options, function(err, db) {

    if (err){
        console.log("que saco")
        throw err;
    }
    var produtos = []
    var produto = {}
    
    // db = DATABASE
    db.query(`SELECT r.FK_PRODUTO, u.SIGLA, r.ESTOQUE, f.FK_FORNECEDOR ,f.NRO_FABRICANTE, p.DESCRICAO, p.FK_PRODUTO_MARCA, c.RAZAO_SOCIAL, s.VALOR, s.LUCRO
    FROM PRODUTO_ESTOQUE_CACHE r, PRODUTO_FORNECEDOR f, PRODUTO p, CADASTRO c, PRODUTO_PRECO s, PRODUTO_UNIDADE u
    WHERE R.FK_PRODUTO = f.FK_PRODUTO and f.FK_PRODUTO = p.ID and f.FK_FORNECEDOR = c.ID and s.FK_PRODUTO = f.FK_PRODUTO and s.FK_TABELA_PRECO = 101 and u.ID = p.FK_PRODUTO_UNIDADE`, function(err, result) {
        // IMPORTANT: close the connection
        for (var index in result) {
            if(index != 0){
                if(result[index].FK_PRODUTO == result[index-1].FK_PRODUTO){
                    
                    //produto.FornecedorId.push(result[index].FK_FORNECEDOR)
                    produto.FornecedorId[result[index].FK_FORNECEDOR] = result[index].NRO_FABRICANTE
                }else{
                    var produto = {}
                    //console.log(produto)
                    produtos.push(produto)             
                    produto.FornecedorId = {}
                    //produto.FornecedorId = []
                    produto.Id = result[index].FK_PRODUTO
                    produto.Estoque = result[index].ESTOQUE
                    result[index].NRO_FABRICANTE = 1 ? produto.Marca = 0 : produto.FornecedorId[result[index].FK_FORNECEDOR] = result[index].NRO_FABRICANTE
                    //produto.FornecedorId.push(result[index].FK_FORNECEDOR)
                    produto.Descricao = result[index].DESCRICAO
                    //produto.FornecedorNome = result[index].RAZAO_SOCIAL
                    produto.Marca = 0
                    produto.preco = result[index].VALOR
                    produto.lucro = result[index].LUCRO
                    produto.id = index        
                }
            }else{
                var produto = {}
                produto.FornecedorId = {}
                //produto.FornecedorId = []
                produto.Id = result[index].FK_PRODUTO
                produto.Estoque = result[index].ESTOQUE
                result[index].NRO_FABRICANTE = 1 ? produto.Marca = 0 : produto.FornecedorId[result[index].FK_FORNECEDOR] = result[index].NRO_FABRICANTE
                //produto.FornecedorId.push(result[index].FK_FORNECEDOR)
                produto.Descricao = result[index].DESCRICAO
                //produto.FornecedorNome = result[index].RAZAO_SOCIAL
                produto.Marca = 0
                produto.preco = result[index].VALOR
                produto.lucro = result[index].LUCRO
                produto.id = index  
                }
                
        }

        produtos.push(produto)
        writeStream.write(JSON.stringify(produtos))
        //produtos.forEach(result => writeStream.write(JSON.stringify(result,null,',')))
        writeStream.on('finish', () => {
        console.log("produtos adicionados com sucesso");
        });

        writeStream.on('error', (err) => {
        console.error(`There is an error writing the file ${pathName} => ${err}`)
        });

        writeStream.end();

        if (err){
            throw err;
        }
        db.detach();
    });

    



});

