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
    console.log("curr is ",curr)
    console.log("x is ",x)
    try{
      await page.goto("https://directory.iu.edu/");
      await page.waitForSelector('input#SearchText');
    } catch(E) {
      continue;
    }
    // Type in name and click
    await page.click("a#searchOptionsBtn");
    await page.select("select#Campus", "EA");
    await page.select("select#Affiliation", "Student")
    await page.click("input#IncludeDepartmentListings")
    await page.click("input#SearchText");

    await page.keyboard.type(curr);
    await page.keyboard.type(String.fromCharCode(13));
    // Type in name and click
    try{
      await page.waitFor(1000);
      await page.waitForSelector('div.results-list', {timeout: 5000});
    } catch(E) {
      console.log("Bad name");
      continue;
    }
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a.ng-binding'))
      return tds.map(td => td.getAttribute("href"))
    });
    for (var i = 0; i<data.length; i++){
      var email = data[i].slice(16,)+"@iu.edu";
      emails.push(email);
    }

    console.log(emails)

    fs.writeFile("IndianaEast_2021_February.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("IndianaEast_2021_February.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
