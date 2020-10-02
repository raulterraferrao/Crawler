const puppeteer = require('puppeteer');
var file = require('./fornecedores.json')

let scrape = async () => {
  const browser = await puppeteer.launch({headless: false, }); // default is true
  const page = await browser.newPage();
  var url;


  try {
        url = `https://www.novacasadistribuidora.com/links/imagens/fornecedores/fornecedores_produtos/195.jpg`
        //console.log(url)
        await page.goto(url).catch( e => console.log(e));
        await page.waitFor(30000);
       // await page.waitForSelector('.table_descricao_produtos', {visible: true});
       // await page.waitForSelector('.li_array_nome_produtos', {visible: true});
       for(var i = 0; i < file.length; i++) {
            var ids = file[i].imgId
        
            url = `https://www.novacasadistribuidora.com/links/imagens/fornecedores/fornecedores_produtos/${ids}.jpg`
            await page.goto(url).catch( e => console.log(e));
            await page.evaluate(async (ids) => {

                if(document.body.querySelector('h1') === null){
                var link = document.createElement('a');
                link.href = `${ids}.jpg`;
                link.download = `${ids}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                }
            },ids)

       }

   // });
} catch (err) {
    console.error(err);
}

}
scrape().then((value) => {
console.log(value)
}) 