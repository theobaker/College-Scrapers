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
  for(var x = 340;x < names.length ;x++){
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)

    try{
      await page.goto("https://directory.utk.edu/search");
      await page.waitFor(200);
      await page.waitForSelector("input#search-bar", {timeout: 10000});
    } catch(E) {
      console.log("Ripped");
      continue;
    }
    try{
      await page.click("input[value='student']");
      await page.click("input[value='knoxville']");
      await page.click("input[value='false']");
      await page.click("input#search-bar")
      await page.keyboard.type(curr+"*");
      await page.keyboard.type(String.fromCharCode(13));
      await page.waitFor(250);
      await page.waitForSelector("dl#queryresults", {timeout: 10000});
      await page.waitFor(500);
    } catch(E) {
      console.log("Bad name");
      continue;
    }
    // Type in name and click
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.textContent)
    });

    for (var i = 0; i<data.length; i++){
      if(data[i].includes("@vols.utk.edu")){
        emails.push(data[i].trim());
      }
    }

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("UTennKnoxville3_2021_February.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("UTennKnoxville3_2021_February.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
