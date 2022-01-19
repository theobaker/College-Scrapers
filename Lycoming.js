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
  await page.goto("https://www.lycoming.edu/search/");
  await page.waitFor(1000);
  //await page.click("a[href='http://lycoapp01.lycoming.edu/WebAdvisor/WebAdvisor?type=P&pid=ST-XWBSTS04A']");
  /*const page2 = await Promise.all([
    new Promise(resolve => page.once('popup', resolve)),
    page.click('a[target=_blank]'),
  ]);*/
  console.log("On second page")
  for(var x = 10;x < names.length;x++){
    await page.goto("http://lycoapp01.lycoming.edu/WebAdvisor/WebAdvisor?type=P&pid=ST-XWBSTS04A")
    try{
      await page.waitForSelector("input#VAR2")

    }
    catch(E) {
      console.log("continue")
    }
    await page.waitFor(1000);
    const curr = names[x];
    console.log("x is ",x);
    console.log("curr is ",curr)
    // Type in name and click
    await page.keyboard.type(curr)
    await page.keyboard.type(String.fromCharCode(13));
    //await page.waitForSelector('div.media');
    try{
      await page.waitForSelector('tbody');
    } catch(e) {
      console.log("continue")
    }
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('p'))
      return tds.map(td => td.textContent)
    });
    page.waitFor(2000);
    //First3 last + first 4 first + @lycoming.edu
    for (var i = 0; i<data.length; i++){
      var person = data[i];
      person = person.split(",");
      var email = person[0].slice(0,3) + person[1].slice(1,5) + "@lycoming.edu"
      emails.push(email)
    }

  /*for (var i = 0; i<data.length; i++){
    if(data[i].includes("@denison.edu")){
      emails.push(data[i].trim());
    }
  }*/

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("Lycoming2_2020_December.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("Lycoming2_2020_December.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
