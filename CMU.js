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
  for(var x = 183;x < names.length;x++){
    const curr = names[x]
    await page.goto("https://directory.andrew.cmu.edu/index.cgi");
    await page.waitForSelector('input#basicsearch')
    // Type in name and click
    await page.click("input#basicsearch")
    await page.keyboard.type(curr);
    await page.keyboard.type(String.fromCharCode(13));
    //page.type(String.fromCharCode(13));
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    //await page.waitForSelector('div.grid');
    try {
      await page.waitForSelector('tbody');
    } catch(E) {
      console.log("Continue")
    }
    await page.waitFor(250);
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td'))
      return tds.map(td => td.textContent)
    });

    for (var i = 0; i<data.length; i++){
      if(i%5==2){
        if(data[i+1]=="Student"){
          emails.push(data[i]+"@andrew.cmu.edu")
        }
      }
    }

  /*for (var i = 0; i<data.length; i++){
    emails.push(data[i]);
  }*/


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("CarnegieMelon2_2020_December.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("CarnegieMelon2_2020_December.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
