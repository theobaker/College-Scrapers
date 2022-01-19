const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  fs.readFile('CommonSmall.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const alpha='abcdefghijklmnopqrstuvwxyz'
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto("https://www.providence.edu/search-email/");
  await page.waitFor(1000)
  for(var x = 0;x < 26;x++){
    for(var y = 0; y < 26;y++) {
      for(var z = 0; z < 26;z++) {
        let curr = alpha[x].toString() + alpha[y].toString() + alpha[z].toString();
        console.log("x is ",x)
        console.log("curr is ",curr)
        // Type in name and click
        await page.click("input#txt_lname", {clickCount: 3});
        await page.keyboard.type(curr);
        await page.click("input[value='Search']");
        await page.waitForSelector('h3');
        await page.waitFor(200);
        //Select table and pull emails into email list
        const data = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll('a[href]'))
          return tds.map(td => td.getAttribute('href'))
        });

        for (var i = 0; i<data.length; i++){
          if (data[i].includes("@friars")){
            emails.push(data[i].trim().replace("mailto:",""));
          }
        }


        //Below this is good
        //Save
        console.log(emails)

        fs.writeFile("ProvidenceCollege_2020_October.txt", emails, function(error){
          if(error)console.log(error);
          console.log("saved");
        });
      }
    }
  }
  fs.writeFile("ProvidenceCollege_2020_October.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
