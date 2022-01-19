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
  for(var x = 728;x < names.length;x++){
    const curr = names[x]
    await page.goto("https://stanford.rimeto.io/search/"+curr+"?filters=%5B%5B%22Title%22%2C%5B%2232489%3A1012%3A1f1e8b%7CUniversity%20-%20Student%20-%20Undergraduate%22%5D%5D%5D&tab=all");
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    try{
      await page.waitForSelector("div#search-result-webdriver-selector-0");
    } catch(e) {
      console.log("Continue");
    }
    await page.waitFor(100);
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.textContent)
    });

    //for (var i = 0; i<data.length; i++){
      //if(i%6==4){
        //var email = data[i];
        //email = email.replace(/(\r\n|\n|\r)/gm, "");
      //  email = email.trim();
      //  emails.push(email);
    //  }
  //  }

  for (var i = 0; i<data.length; i++){
    if(data[i].includes("@stanford.edu")){
      emails.push(data[i]);
    }
  }


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("stanford14_2020_November.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("stanford14_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
