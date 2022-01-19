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
    const curr = alph[x].toString();
    await page.goto("https://www.creighton.edu/search/", {timeout: 50000});
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.waitForSelector("input[name='search']");
    await page.click("input[name='search']");
    await page.keyboard.type(curr);
    await page.keyboard.type(String.fromCharCode(13));
    await page.waitForSelector("div.id_card");
    //Select table and pull emails into email list
    for(var i = 0; i<60; i++){
      try{
        var next = 1 + (i*15);
        await page.goto("https://ami.creighton.edu/action/search?next="+next.toString());
        console.log(next);
        await page.waitFor(1000);
        const names = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll('span.id_left'))
          return tds.map(td => td.textContent)
        });

        const roles = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll('div.id_dept'))
          return tds.map(td => td.textContent)
        });

        for (var n = 0; n<names.length; n++){
          if(roles[n].includes("Coll")){
            var email = names[n].replace(" ","");
            email = email.replace("-","");
            emails.push(email+"@creighton.edu");
          }
        }
        console.log(emails);
        //Save
        fs.writeFile("Creighton_2021_January.txt", emails, function(error){
          if(error)console.log(error);
          console.log("saved");
        });
      } catch(e) {
        console.log("Error", e.stack);
        console.log("Error", e.name);
        console.log("Error", e.message);
        continue;
      }
    }

    //Below this is good

  }
  fs.writeFile("Creighton_2021_January.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
