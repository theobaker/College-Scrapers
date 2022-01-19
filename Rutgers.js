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
  await page.goto("https://search.rutgers.edu/people.html?");
  for(var x = 0;x < 1;x++){
    let pages = [];
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    try{
      await page.goto("https://search.rutgers.edu/people.html?q="+curr+"*");
      await page.waitFor(1000);
      //await page.waitForSelector('tbody', {timeout: 10000});
    } catch(E) {
      console.log("Bad name");
      continue;
    }
    //Select table and get URLs of people
    const links = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td > a'))
      return tds.map(td => td.getAttribute("href"))
    });
    //Figure out which students are undergrads
    const roles = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td > a'))
      return tds.map(td => td.nextSibling.textContent)
    });
    //Only add our undergrads to URL list to check
    for (var i = 0; i<links.length; i++){
      if(roles[i].includes("Student")){
        pages.push(links[i])
      }
    }
    //Visit each page of an undergrad and get their email
    for (var z = 0; z < pages.length; z++){
      try {
        await page.goto(pages[z]);
        await page.waitFor(200);
        await page.waitForSelector("h3.c");
        const tags = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll('a'))
          return tds.map(td => td.textContent)
        });
        for (var y = 0; y < tags.length; y++){
          if (tags[y].includes("@rutgers.edu")){
            emails.push(tags[y]);
            console.log(tags[y]);
          }
        }
      } catch(E) {
        console.log("Bad page");
        fs.writeFile("Rutgers_2021_February.txt", emails, function(error){
          if(error)console.log(error);
          console.log("saved");
        });
        continue;
      }
    }
    //Save
    console.log(emails)
    fs.writeFile("Rutgers_2021_February.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });
  }


  fs.writeFile("Rutgers_2021_February.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
