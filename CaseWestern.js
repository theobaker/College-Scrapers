const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  fs.readFile('CommonFirst2.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  for(var x = 189;x < names.length;x++){
    const curr = names[x];
    console.log("x is ",x);
    console.log("curr is ",curr);
    await page.goto("https://webapps.case.edu/directory/lookup?search_text=&surname=&givenname="+curr+"&department=&location=&category=student&search_method=phonetic");
    try {
      await page.waitForSelector('tbody');
    } catch(E) {
      console.log("Continue")
    }
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.textContent)
    });

    for (var i = 0; i<data.length; i++){
      if (data[i].includes("@case.edu")){
        emails.push(data[i]);
      }
    }

  /*for (var i = 0; i<data.length; i++){
    emails.push(data[i]);
  }*/


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("CaseWestern3_2020_December.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("CaseWestern3_2020_December.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
