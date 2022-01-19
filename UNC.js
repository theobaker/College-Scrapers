const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];
let alph = "abcdefghijklmnopqrstuvw";

(async () => {
  fs.readFile('Common_Letters.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  for(var x = 0;x < names.length;x++){
    const curr = names[x];
    console.log("x is ",x);
    console.log("curr is ",curr);
    for(var z = 0; z < 23; z++) {
      try{
        await page.goto("https://dir.itsapps.unc.edu/search/?affiliation=student&firstName="+alph[z].toString()+"%2a&lastName="+curr+"%2a");
        await page.waitFor(500);
        await page.waitForSelector('h2', {timeout: 3000});
        const aHandleArray = await page.$$('h2');
        for (const el of aHandleArray) {
          await el.click();
          await page.waitFor(100);
        }
        const bHandleArray = await page.$$('h2');
        for (const el of bHandleArray) {
          await el.click();
          await page.waitFor(100);
          const data = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('a'))
            return tds.map(td => td.textContent)
          });

          for (var i = 0; i<data.length; i++){
            if(data[i].includes("@live.unc.edu")){
              emails.push(data[i]);
            }
          }
        }
      } catch(E) {
        console.log("Bad name");
        continue;
      }
    }


    console.log(emails)

    fs.writeFile("UNC_2021_March.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("UNC_2021_March.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
