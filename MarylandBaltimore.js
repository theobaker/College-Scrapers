const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];
let alph = "abcdefghijklmnopqrstuvwxyz";

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  for(var x = 0;x < 26;x++){
    try{
      const curr = alph[x].toString();
      await page.goto("https://cf.umaryland.edu/directory/index.cfm");
      console.log("x is ",x)
      console.log("curr is ",curr)
      // Type in name and click
      await page.waitForSelector('input#name');
      await page.waitFor(100);
      await page.select("select#affiliation", "student");
      await page.click("input#name");
      await page.keyboard.type(curr);
      await page.keyboard.type(String.fromCharCode(13));
      await page.waitForSelector("div#directory");
      //Select table and pull emails into email list
      const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('a'))
        return tds.map(td => td.textContent)
      });

      for (var i = 0; i<data.length; i++){
        if(data[i].includes("@umaryland.edu")){
          emails.push(data[i]);
        }
      }
    } catch(E) {continue;}


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("UMarylandBaltimore_2020_December.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("UMarylandBaltimore_2020_December.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
