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
  for(var x = 0;x < 2;x++){
    const curr = names[x];
    await page.goto("https://directory.middlebury.edu/");
    await page.waitForSelector('input#ctl00_ctl00_PageContent_PageContent_middDirectoryForm_txtSimpleSearch');
    // Type in name and click
    await page.click("input#ctl00_ctl00_PageContent_PageContent_middDirectoryForm_txtSimpleSearch");
    await page.keyboard.type(alph[x].toString());
    await page.keyboard.type(String.fromCharCode(13));
    //page.type(String.fromCharCode(13));
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    //await page.waitForSelector('div.grid');
    await page.waitForSelector('tbody');
    await page.waitFor(500);
    try{
      for (var i = 10; i < 200; i++){
        var nextelm = "a"+"[id='ctl00_ctl00_PageContent_PageContent_middDirectoryForm_lstResults_ctl"+(i+5).toString()+"_lnkName']"
        var elm = "a"+"[id='ctl00_ctl00_PageContent_PageContent_middDirectoryForm_lstResults_ctl"+i.toString()+"_lnkName']"
        page.hover(nextelm);
        page.click(elm);
        await page.waitFor(100);
        var sel = await page.$("span#rptProperties_ctl01_lblPropertyValue");
        var role = await (await sel.getProperty('textContent')).jsonValue();
        if (role == "Student") {
          var email = await page.$("span#rptProperties_ctl02_lblPropertyValue");
          var text = await (await email.getProperty('textContent')).jsonValue();
          //console.log(text);
          emails.push(text);
        }
      }
    } catch(E) {console.log("Bummer")}


    console.log(emails)

    fs.writeFile("Middlebury3_2020_December.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("Middlebury3_2020_December.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
