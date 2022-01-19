const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  fs.readFile('Common_Letters_Doubles.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  for(var x = 0;x < names.length;x++){
    const curr = names[x];
    console.log("curr is ",curr)
    console.log("x is ",x)
    try{
      await page.goto("https://jagaspx2.southalabama.edu/dirscan/");
      await page.waitForSelector('input#LastName');
    } catch(E) {
      continue;
    }
    // Type in name and click
    await page.click("input[value='S']")
    await page.click("input#LastName");
    await page.keyboard.type(curr);
    await page.keyboard.type(String.fromCharCode(13));
    // Type in name and click
    try{
      await page.waitFor(500);
      await page.waitForSelector('tbody', {timeout: 2500});
    } catch(E) {
      console.log("Bad name");
      continue;
    }
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.textContent)
    });
    for (var i = 0; i<data.length; i++){
      if(data[i].includes("southalabama.edu")){
        emails.push(data[i]);
      }
    }

    console.log(emails)

    fs.writeFile("SouthernAlabama_2021_February.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("SouthernAlabama_2021_February.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();