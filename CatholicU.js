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
    await page.goto("https://directory.catholic.edu/index.php");
    await page.waitForSelector("input#search_word")
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.click("input#search_word")
    await page.keyboard.type(curr);
    await page.click("input#view_directory")
    //await page.waitForSelector('div.media');
    await page.waitForSelector('ul.accordion-container');
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('h4'))
      //console.log(tds)
      return tds.map(td => td.getAttribute("class"))
    });

    for (var i = 0; i<data.length-1; i++){
      var email = data[i].slice(30,);
      emails.push(email);
    }

  /*for (var i = 0; i<data.length; i++){
    if(data[i].includes("@denison.edu")){
      emails.push(data[i].trim());
    }
  }*/

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("CatholicUniversity_2020_November.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("CatholicUniversity_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
