const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  fs.readFile('CommonFirst2.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  for(var x = 0;x < names.length;x++){
    const curr = names[x]
    console.log("x is ",x);
    console.log("curr is ",curr);
    //Go to name page and scroll through each 10 pages
    for(var n = 1; n < 25; n++){
      try{
        await page.goto("https://directory.okstate.edu/index.php/module/Default/action/PersonSearch?campus=&first_name="+curr+"&last_name=&page="+n.toString());
        await page.waitFor(200);
        await page.waitForSelector('tbody', {timeout: 10000});
      } catch(E) {
        console.log("Bad page");
        break;
      }

      //Select table and pull emails into email list
      const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('td'))
        return tds.map(td => td.textContent)
      });
      //Push emails to list
      for (var i = 4; i<data.length; i+=6){
        if(data[i-3].trim()=="Student"){
          emails.push(data[i].trim());
        }
      }

      //Below this is good
      //Save
      console.log(emails)

      fs.writeFile("OKStateAll_2021_February.txt", emails, function(error){
        if(error)console.log(error);
        console.log("saved");
      });
    }


  }
  fs.writeFile("OKStateAll_2021_February.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
