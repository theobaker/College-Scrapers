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
  for(var x = 0;x < 1000;x++){
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    await page.goto("https://win.wfu.edu/win/app.dirx.ExternalDirectory");
    await page.waitForSelector("input[name='fullName']")
    await page.click("input[name='fullName']");
    await page.keyboard.type(curr);
    await page.click("input[name='submit_button']")
    await page.waitFor(2000);
    //Go to each name
    await page.evaluate(() => {
      console.log("Here");
      let elements = $('[href="javascript:void(0);"]').toArray();
      for (i = 0; i < elements.length; i++) {
        $(elements[i]).click();
        //page.waitFor(2000);
        //page.goBack();
      }
    });


    //Get all the emails
    /*const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      //console.log(tds)
      return tds.map(td => td.textContent)
    });

    /*for (var i = 0; i<data.length-1; i++){
      var email = data[i].slice(30,);
      emails.push(email);
    }*/

  /*for (var i = 0; i<data.length; i++){
    if(data[i].includes("@wfu.edu")){
      emails.push(data[i].trim());
    }
  }*/

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("WakeForest_2020_November.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("WakeForest_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
