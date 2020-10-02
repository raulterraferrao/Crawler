const fs = require('fs');
const writeStream = fs.createWriteStream('produtosMerged.json');
const pathName = writeStream.path;
var ncJson = require('./ncModel.json')
var dbJson = require('./dbModel.json')

var produtos = []
const ncID = "36"
var test = {}
var flag;

//console.log(dbJson[0].FornecedorId[ncID])

for(var i = 0 ; i < ncJson.length; i++){
    var ids = ncJson[i].variantes.codigo
    flag = true;
    for( id in ids){ 
        produtoDb = dbJson.find(el => ids[id] == el.FornecedorId[ncID])
        if(produtoDb !== undefined){
            if(flag){     
                var produto = {
                    idSistema: [],
                    nome: "",
                    descricao: [],
                    marca: "",
                    preco: [],
                    estoque : [],
                    embalagem: []
                    }
                produto.nome = ncJson[i].nome
                produto.marca = ncJson[i].fornecedor
                flag = false
                //console.log(ncJson[i].nome)
            }
            produto.descricao.push(ncJson[i].variantes.descricao[id])
            produto.embalagem.push(ncJson[i].variantes.embalagem[id])
            produto.idSistema.push(produtoDb.Id)
            produto.preco.push(produtoDb.preco)
            produto.estoque.push(produtoDb.Estoque)       

        }        
    }
    if(!flag){
        produtos.push(produto)
    }
    
  }
  console.log(produtos)

