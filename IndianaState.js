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
  for(var x = 277;x < names.length;x++){
    const curr = names[x]
    for(var y = 0; y < 6; y++){

      console.log("x is ",x)
      console.log("curr is ",curr)
      // Type in name and click
      try{
        await page.goto("https://www.indstate.edu/search/students?search="+curr+"&page="+(y.toString()));
        await page.waitFor(700);
        await page.waitForSelector('span.link', {timeout: 5000});
      } catch(E) {
        console.log("Bummer");
        break;
      }

      try{
        //Press ALL the buttons
        const elHandleArray = await page.$$('span.link');

        for (const el of elHandleArray) {
          await el.click();
        }
        await page.waitFor(500);
      } catch(E) {
        console.log("Tough");
        continue;
      }



      //Select table and pull emails into email list
      const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('a'))
        return tds.map(td => td.textContent)
      });

      for (var i = 0; i<data.length; i++){
        if(data[i].includes("@sycamores.indstate.edu")){
          emails.push(data[i]);
        }
      }

      //Below this is good
      //Save
      console.log(emails)

      fs.writeFile("IndianaState2_2021_February.txt", emails, function(error){
        if(error)console.log(error);
        console.log("saved");
      });

    }

  }
  fs.writeFile("IndianaState2_2021_February.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
