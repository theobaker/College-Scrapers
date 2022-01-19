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
  for(var x = 0;x < names.length;x++){
    const curr = names[x];
    try{
      await page.goto("https://uwm.edu/search/people?q=%2a"+curr+"%2a");
      console.log("x is ",x)
      console.log("curr is ",curr)
      // Wait for data
      await page.waitFor(50);
      await page.waitForSelector('table');
    } catch(E){
      console.log("Bad search");
      continue;
    }
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td.tbl-c-30'))
      return tds.map(td => td.textContent)
    });

  for (var i = 1; i<data.length; i+=2){
    if(data[i-1]=="Freshman" || data[i-1]=="Junior" || data[i-1]=="Sophomore" || data[i-1]=="Senior"){
      emails.push(data[i].trim());
    }
  }

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("WiscoMilwaukee_2021_January.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("WiscoMilwaukee_2021_January.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
