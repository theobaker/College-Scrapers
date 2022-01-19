const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  fs.readFile('Common_Letters.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  for(var x = 478;x < names.length;x++){
    const curr = names[x]
    for(var y = 0; y < 2; y++){
      await page.goto("https://adminapps.utep.edu/campusdirectory/People/Students/"+((y*10).toString())+"?queryString="+curr+"#results");
      console.log("x is ",x)
      console.log("curr is ",curr)
      // Type in name and click
      try{
        await page.waitFor(200);
        await page.waitForSelector('header.directory-item-header', {timeout: 10000});
      } catch(E) {
        console.log("Bummer");
        continue;
      }

      //Select table and pull emails into email list
      const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('a'))
        return tds.map(td => td.textContent)
      });

      for (var i = 0; i<data.length; i++){
        if(data[i].includes("@miners.utep.edu")){
          emails.push(data[i]);
        }
      }

      //Below this is good
      //Save
      console.log(emails)

      fs.writeFile("UTexasElPaso2_2021_February.txt", emails, function(error){
        if(error)console.log(error);
        console.log("saved");
      });

    }

  }
  fs.writeFile("UTexasElPaso2_2021_February.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
