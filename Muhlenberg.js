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
  await page.goto("https://www.muhlenberg.edu/directory/");
  for(var x = 0;x < 26;x++){
    for(var y = 0; y < 26;y++) {
        let curr = alpha[x].toString() + alpha[y].toString();
        console.log("x is ",x)
        console.log("curr is ",curr)
        await page.goto("https://www.muhlenberg.edu/directory/results/?name="+curr);
        await page.waitFor(200)
        //await page.waitForSelector('tbody');
        //Select table and pull emails into email list
        const data = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll('a'))
          return tds.map(td => td.textContent)
        });

        for (var i = 0; i<data.length; i++){
          if (data[i].includes("muhlenberg.edu")){
            emails.push(data[i].trim());
          }
        }


        //Below this is good
        //Save
        console.log(emails)

        fs.writeFile("MuhlenbergCollege_2020_November.txt", emails, function(error){
          if(error)console.log(error);
          console.log("saved");
        });
      }
  }
  fs.writeFile("MuhlenbergCollege_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
