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
  for(var x = 0;x < names.length;x++){
    const curr = names[x];
    await page.goto("https://info.ecu.edu/directory/");
    await page.waitForSelector('input#lastName');
    // Type in name and click
    await page.click("input#filter_1")
    await page.click("input#lastName");
    await page.keyboard.type(curr);
    await page.keyboard.type(String.fromCharCode(13));
    //page.type(String.fromCharCode(13));
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    //await page.waitForSelector('div.grid');
    try{
      await page.waitForSelector('div#accordion1');
    } catch(E) {
      console.log("Bad name");
      continue;
    }
    await page.waitFor(500);
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.textContent)
    });
    for (var i = 0; i<data.length; i++){
      if(data[i].includes("@students.ecu.edu")){
        emails.push(data[i]);
      }
    }

    /*try{
      for (var i = 1; i < 200; i++){
        var nextelm = "button[data-target='#collapse"+(i+1).toString()+"']"
        var elm = "button[data-target='#collapse"+i.toString()+"']"
        page.hover(nextelm);
        page.click(elm);
        await page.waitFor(2000);
        var sel = await page.$("tbody > tr > td > a");
        var mail = await (await sel.getProperty('textContent')).jsonValue();
        console.log(mail);
        emails.push(mail);
      }
    } catch(E) {
      console.log("Bummer")
    } */
    console.log(emails)

    fs.writeFile("EasternCarolina_2021_January.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("EasternCarolina_2021_January.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
