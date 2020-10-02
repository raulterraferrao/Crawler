const puppeteer = require('puppeteer');
const fs = require('fs');
const writeStream = fs.createWriteStream('fornecedores.txt');
const pathName = writeStream.path;

//https://www.novacasadistribuidora.com/modelo_tabela_produtos_include2.php?detalhes=28435
//Nome Produto
//Cod
//Descrição
//Emb
//Fornecedor
//FOTO Fornecedor

/* {
  nome: Bla ,
  fornecedo: asd
  variantes: {
    cod: 
    desc:
    emb:
  }
} */

function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}


let scrape = async () => {
   
    let url = 'https://www.novacasadistribuidora.com/produtos2.php?grupo=1'
    const browser = await puppeteer.launch({headless: false}); // default is true
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.li_produtos_rodape', {visible: true});
    //await page.waitFor(30000);
    var arrayOfResults = []
    var fornecedorId = []
    var fornecedorImgId = []
    var UnicfornecedorId = []
    var UnicfornecedorImgId = []
    var objectFornecedor = {}
  
    for(var i = 1; i< 119; i++){
        let url = `https://www.novacasadistribuidora.com/produtos2.php?grupo=${i}`
        await page.goto(url);
        //await page.waitForSelector('.li_produtos_rodape', {visible: true});
        //await page.waitFor(300);
        fornecedorId = fornecedorId.concat(await page.evaluate(async () => {
            var produtos = []
                produtos = [].map.call(document.querySelectorAll('.li_produtos_rodape'), (produto) => {
                        return produto.innerText
                })        
            return produtos
        }))

        fornecedorImgId = fornecedorImgId.concat(await page.evaluate(async () => {
            var produtosImg = []
                produtosImg = [].map.call(document.querySelectorAll('.img_produtos_rodape'), (produto) => {
                       return produto.getAttribute('src').substring(49, produto.getAttribute('src').indexOf("."))
                })
            
            return produtosImg
        }))


    }
        for(var i = 0; i < fornecedorId.length; i ++){
            arrayOfResults.push({
                fornecedor : fornecedorId[i],
                imgId : fornecedorImgId[i]
            })
           
        }
        
        arrayOfResults = getUniqueListBy(arrayOfResults,'fornecedor')
       /*  UnicfornecedorId = [...new Set(fornecedorId)];
        UnicfornecedorImgId = [...new Set(fornecedorImgId)];
        arrayOfResults.push(UnicfornecedorId)
        arrayOfResults.push(UnicfornecedorImgId) */

    arrayOfResults.forEach(result => writeStream.write(JSON.stringify(result)))

    writeStream.on('finish', () => {
    console.log("produtos adicionados com sucesso");
    });

    writeStream.on('error', (err) => {
    console.error(`There is an error writing the file ${pathName} => ${err}`)
    });

    writeStream.end();
    browser.close()
    return 'ok'

    //links/imagens/produtos_temp3/26098.jpg caminho imagens
      //modelo_tabela_produtos_include2.php?detalhes=26015 caminho produtos
}
    
scrape().then((result) => {
  console.log(result)
})