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
  for(var x = 660;x < names.length;x++){
    try{
      const curr = names[x]
      await page.goto("https://www.uwp.edu/searchresults.cfm?q="+curr);
      console.log("x is ",x)
      console.log("curr is ",curr)
      // Type in name and click
      await page.waitForSelector('tbody', {timeout: 8000});
      await page.waitFor(500);
      await page.click("button[onclick='showAllStudents()']");
      await page.waitFor(500);
      //Select table and pull emails into email list
      const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('a'))
        return tds.map(td => td.textContent)
      });

      for (var i = 0; i<data.length; i++){
        if(data[i].includes("@rangers")){
          emails.push(data[i]);
        }
      }
    } catch(E) {continue;}


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("WiscoParkside2_2020_December.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("WiscoParkside2_2020_December.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
