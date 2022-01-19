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
  await page.goto("https://web.mit.edu/bin/cgicso?options=lastnamesx&query=Fer");
  for(var x = 0;x < names.length;x++){
    let pages = [];
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    try{
      await page.goto("https://web.mit.edu/bin/cgicso?options=lastnamesx&query="+curr);
      await page.waitFor(400);
      await page.waitForSelector('pre');
    } catch(E) {
      console.log("Bad name");
      continue;
    }
    //Select table and get URLs of people
    const links = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('pre > a'))
      return tds.map(td => "https://web.mit.edu/"+td.getAttribute("href"))
    });
    //Figure out which students are undergrads
    const roles = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('pre > a'))
      return tds.map(td => td.nextSibling.textContent)
    });
    //Only add our undergrads to URL list to check
    for (var i = 0; i<links.length; i++){
      if(roles[i].includes("year") || roles[i].includes("Year 1")){
        if(!roles[i].includes("year G")){
          pages.push(links[i])
        }
      }
    }
    //Visit each page of an undergrad and get their email
    for (var z = 0; z < pages.length; z++){
      try {
        await page.goto(pages[z]);
        await page.waitFor(200);
        await page.waitForSelector("pre");
        const tags = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll('a'))
          return tds.map(td => td.textContent)
        });
        for (var y = 0; y < tags.length; y++){
          if (tags[y].includes("@MIT.EDU")){
            emails.push(tags[y]);
            console.log(tags[y]);
          }
        }
      } catch(E) {
        console.log("Bad page");
        fs.writeFile("MIT_2021_January.txt", emails, function(error){
          if(error)console.log(error);
          console.log("saved");
        });
        await page.waitFor(300000)
        continue;
      }
    }
    //Save
    console.log(emails)
    fs.writeFile("MIT_2021_January.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });
  }


  fs.writeFile("MIT_2021_January.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
