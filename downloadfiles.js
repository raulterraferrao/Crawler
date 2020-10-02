var file = require('./produtos.json')
var produtos = file[0].variantes.codigo

 const puppeteer = require('puppeteer');

let scrape = async () => {
  const browser = await puppeteer.launch({headless: false, }); // default is true
  const page = await browser.newPage();
  var url;


  try {
        url = `https://www.novacasadistribuidora.com/links/imagens/produtos_alta_resolucao/123131231312.jpg`
        //console.log(url)
        await page.goto(url).catch( e => console.log(e));
        await page.waitFor(30000);
       // await page.waitForSelector('.table_descricao_produtos', {visible: true});
       // await page.waitForSelector('.li_array_nome_produtos', {visible: true});
       for(var i = 0 ; i < file.length; i++){
         var ids = file[i].variantes.codigo
          for( id in ids){ 
            url = `https://www.novacasadistribuidora.com/links/imagens/produtos_alta_resolucao/${ids[id]}.jpg`
            await page.goto(url).catch( e => console.log(e));
            await page.evaluate(async (ids,id) => {

              if(document.body.querySelector('h1') === null){
                var link = document.createElement('a');
                link.href = `${ids[id]}.jpg`;
                link.download = `${ids[id]}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
          },ids,id)
            //await page.waitFor(1000);
          }
       }

   // });
} catch (err) {
    console.error(err);
}

}
scrape().then((value) => {
console.log(value)
}) 
 