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
    try{
      await page.goto("http://www.umsl.edu/directory/");
      await page.waitForSelector('div.input-group');
      // Type in name and click
      await page.click("input[value='student']")
      await page.click("div.input-group");
      await page.keyboard.type(curr);
      await page.keyboard.type(String.fromCharCode(13));
      //page.type(String.fromCharCode(13));
      console.log("x is ",x)
      console.log("curr is ",curr)
      // Type in name and click
      await page.waitFor(1250);
      //Collect elements and go
      const handles = await page.$$('li.show_hide > a');
      console.log(handles.length)
      for (const handle of handles){
        await handle.click();
        var email = await page.$("span.dd > strong > a");
        var text = await (await email.getProperty('textContent')).jsonValue();
        //console.log(text);
        emails.push(text);
        await page.waitFor(10);
      }
    } catch(E) {
      console.log("Bummer");
      continue;
    }

    console.log(emails)

    fs.writeFile("MissouriStLouis_2020_December.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("MissouriStLouis_2020_December.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
