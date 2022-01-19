const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  fs.readFile('CommonMedium.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  for(var x = 3654;x < names.length;x++){
    const curr = names[x]
    if (curr.length < 4) {continue;}
    try{
      await page.goto("https://www.ithaca.edu/directories/");
      await page.waitForSelector('input#dirSearch')
      // Type in name and click
      await page.click("input#dirSearch")
      await page.keyboard.type(curr);
      await page.keyboard.type(String.fromCharCode(13));
    } catch(E) {
      continue;
    }
    //page.type(String.fromCharCode(13));
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    //await page.waitForSelector('div.grid');
    try {
      await page.waitForSelector('div#dirSearchResults', {timeout: 6000});
    } catch(E) {
      console.log("Continue")
    }
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.textContent)
    });

    for (var i = 0; i<data.length; i++){
      if(data[i].includes("@ithaca.edu")){
        emails.push(data[i]);
      }
    }

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("Ithaca11_2020_December.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("Ithaca11_2020_December.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
