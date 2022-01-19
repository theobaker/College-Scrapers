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
  for(var x = 1330;x < names.length;x++){
    const curr = names[x]
    await page.goto("http://directory.service.emory.edu/index.cfm");
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.waitForSelector("input#SrchStr");
    await page.click("input#SrchStr");
    await page.keyboard.type(curr);
    await page.keyboard.type(String.fromCharCode(13));
    await page.waitFor(500);
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td'))
      return tds.map(td => td.textContent)
    });

    for (var i = 4; i<data.length-4; i++){
      if(i%4==2){
        var email = data[i].trim();
        email = email.replace(/ /g, ".");
        emails.push(email+"@emory.edu");
      }
    }

  /*for (var i = 0; i<data.length; i++){
    if(data[i].includes("@stanford.edu")){
      emails.push(data[i]);
    }
  }*/


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("Emory8_2020_November.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("Emory8_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
