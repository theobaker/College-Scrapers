const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  fs.readFile('common.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto("https://www.eiu.edu/");
  await page.waitFor(2000)
  await page.click("i.fa.fa-search.fa-lg.searchbt")
  for(var x = 0;x < names.length;x++){
    await page.goto("https://www.eiu.edu/#search");
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.click("input.morphsearch-input", {clickCount: 3});
    await page.keyboard.type(curr);
    await page.click("button.morphsearch-submit");
    await page.waitFor(200);
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
    if (data[i].includes("@")){
      emails.push(data[i]);
    }
  }


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("eiu.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("eiu.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
