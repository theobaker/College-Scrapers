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
  for(var x = 76;x < names.length;x++){
    await page.goto("https://home.dartmouth.edu/directory");
    await page.waitForSelector('div.dartmouth_directory');
    await page.waitFor(500);
    await page.click("input[Value='Faculty']");
    await page.click("input[Value='Staff']");
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.click("input[name='dart_directory_last_name']", {clickCount: 3});
    await page.waitFor(20);
    await page.keyboard.type(curr);
    //await page.type(String.fromCharCode(13));
    //await page.waitForSelector('div.directory-module');
    await page.waitForSelector('section.intro');
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.textContent)
    });

    for (var i = 0; i<data.length; i++){
      if(data[i].includes("@Dartmouth.edu")){
        emails.push(data[i]);
      }
    }


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("dartmouth2.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("dartmouth2.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
