const puppeteer = require('puppeteer');
const fs = require('fs');

const writeStream = fs.createWriteStream('file.txt');
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
    const browser = await puppeteer.launch({headless: false}); // default is true
    const page = await browser.newPage();
    var url;
    
    //await page.waitFor(30000);

    try {
      // read contents of the file
      const data = fs.readFileSync('file1.txt', 'UTF-8');
  
      // split the contents by new line
      const lines = data.split(/\r?\n/);
      var conjunto = []
      // print all lines
      //lines.forEach(async (line) => {
        for( line in lines){

          url = `https://www.novacasadistribuidora.com/modelo_tabela_produtos_include2.php?detalhes=${lines[line]}`
          //console.log(url)
          await page.goto(url).catch( e => console.log(e));
          await page.waitForSelector('.table_descricao_produtos', {visible: true});
          await page.waitForSelector('.li_array_nome_produtos', {visible: true});
          const result = await page.evaluate(() => {
              var produtos = {}
              var codigos = []
              var descricoes = []
              var embalagens = []
              /* //const produtos = []
              document.querySelector('.li_array_nome_produtos h3_produtos h3_produtos_include')
                      .forEach((produto) => produtos.push(produto.getAttribute('href').substring(produto.getAttribute('href').indexOf('=') + 1)))
              return produtos */
              
              produtos.nome = document.querySelector('.li_array_nome_produtos').innerHTML
              produtos.fornecedor = document.querySelector('.li_array_produtos.li_fornecedor').textContent
              codigos = [].map.call(document.querySelectorAll('.li_array_produtos.li_cod_nc'), (produto) => {
                return produto.textContent
              })
              descricoes = [].map.call(document.querySelectorAll('.li_array_produtos.li_descricao'), (produto) => {
                return produto.textContent
              })
              embalagens = [].map.call(document.querySelectorAll('.li_array_produtos.li_emb'), (produto) => {
                return produto.textContent
              })
              produtos.variantes = {
                codigo : codigos,
                descricao : descricoes,
                embalagem : embalagens
              }
              
              return produtos
          })
          conjunto.push(result)
        }
     // });
  } catch (err) {
      console.error(err);
  }
      
      //conjunto.forEach(value => writeStream.write(`${value}\n`))
      conjunto.forEach(value => writeStream.write(JSON.stringify(value)))
        
      writeStream.on('finish', () => {
        console.log('ok');
      });
      writeStream.end();
      browser.close()
      return 'ok dokey'

      //links/imagens/produtos_temp3/26098.jpg caminho imagens
      //modelo_tabela_produtos_include2.php?detalhes=26015 caminho produtos
}
    
scrape().then((value) => {
  console.log(value)
})



