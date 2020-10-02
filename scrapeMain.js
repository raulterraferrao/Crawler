const puppeteer = require('puppeteer');
const fs = require('fs');
const writeStream = fs.createWriteStream('file1.txt');
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



let scrape = async () => {
   
    let url = 'https://www.novacasadistribuidora.com/busca_produtos.php'
    const browser = await puppeteer.launch({headless: false}); // default is true
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.nome_produto_h2', {visible: true});
    await page.waitFor(30000);
  

    const results = await page.evaluate(async () => {
      var produtos = []
      produtos = [].map.call(document.querySelectorAll('.esse_teste_include2'), (produto) => {
        return produto.getAttribute('href').substring(produto.getAttribute('href').indexOf('=') + 1)
      })
      return produtos
    })
      await results.forEach(result => writeStream.write(`${result}\n`))

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



