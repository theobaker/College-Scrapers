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
  for(var x = 0;x < names.length;x++){
    if(x%5==1){
      await page.waitFor(480000)
    }
    const curr = names[x]
    await page.goto("https://webapp2.bradley.edu/directorylookup/results?searchby=anything&query="+curr+"&mode=d&Search=Submit");
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    try{
      await page.waitForSelector("div.container", {timeout: 10000});
    } catch(e) {
      console.log("Continue")
    }
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.getAttribute("href"))
    });

    for (var i = 0; i<data.length; i++){
      var email = String(data[i]);
      if(email.includes("details")){
        email = email.slice(14,)
        email = email.replace(/&type=person&mode=d/,"")
        emails.push(email+"@mail.bradley.edu");
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

    fs.writeFile("Bradley6_2020_November.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });
  }
  fs.writeFile("Bradley6_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
