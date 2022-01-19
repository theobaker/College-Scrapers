const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  fs.readFile('Common_Letters_Doubles.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  for(var x = 0;x < names.length;x++){
    const curr = names[x]
    await page.goto("https://directory.tufts.edu/");
    await page.waitForSelector('input.text')
    // Type in name and click
    await page.click("input[value='Students']")
    await page.click("input.text");
    await page.keyboard.type(curr);
    await page.keyboard.type(String.fromCharCode(13));
    //page.type(String.fromCharCode(13));
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    //await page.waitForSelector('div.grid');
    await page.waitForSelector('tbody');
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td'))
      return tds.map(td => td.textContent)
    });

    for (var i = 0; i<data.length; i++){
      if(i%3==0){
        var person = data[i];
        person = person.split(",")
        lname = person[0];
        try{
          fname=person[1].slice(1,).split(" ")[0];
        } catch(E) {
          fname="dud";
        }
        emails.push(fname+"."+lname+"@tufts.edu");
      }
    }

  /*for (var i = 0; i<data.length; i++){
    emails.push(data[i]);
  }*/


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("Tufts_2020_December.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("Tufts_2020_December.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
