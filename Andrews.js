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
  await page.goto("https://www.andrews.edu/directory/");
  for(var x = 0;x < names.length;x++){
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.click("input#directorySearch",{clickcount: 3})
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(curr);
    //await page.waitForSelector('div.media');
    await page.waitFor(500);
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td'))
      return tds.map(td => td.textContent)
    });

    for (var i = 0; i<data.length; i++){
      if(i%5==1){
        var email = data[i];
        email = email.trim();
        if(email.length>1){
          emails.push(email+"@andrews.edu");
        }
      }
    }

  /*for (var i = 0; i<data.length; i++){
    if(data[i].includes("@denison.edu")){
      emails.push(data[i].trim());
    }
  }*/

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("Andrews_2020_November.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("Andrews_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
