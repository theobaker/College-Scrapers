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
  //await page.goto("https://search.rutgers.edu/people.html?q=smi");
  for(var x = 155;x < names.length;x++){
    let pages = [];
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    try{
      await page.goto("https://www.utsa.edu/directory/AdvancedSearch_Person?facultystaffindicator=X&firstname=&lastname="+curr+"&depttitle=+&jobtitle=&phone=&email=");
      await page.waitFor(400);
      await page.waitForSelector('tbody', {timeout: 10000});
    } catch(E) {
      console.log("Bad name");
      continue;
    }
    //Select table and get URLs of people
    const links = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a.fullName'))
      return tds.map(td => "https://www.utsa.edu" + td.getAttribute("href"))
    });
    //console.log(links);

    //Visit each page of an undergrad and get their email
    for (var z = 0; z < links.length; z++){
      try {
        await page.goto(links[z]);
        await page.waitFor(200);
        await page.waitForSelector("td.td1");
        const tags = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll('td.td1'))
          return tds.map(td => td.textContent)
        });
        for (var y = 0; y < tags.length; y++){
          if(y%4==3){
            emails.push(tags[y].trim());
            console.log(tags[y].trim());
          }
        }
      } catch(E) {
        console.log("Bad page");
        fs.writeFile("Rutgers_2021_February.txt", emails, function(error){
          if(error)console.log(error);
          console.log("saved");
        });
        await page.waitFor(100);
        continue;
      }
    }
    //Save
    console.log(emails)
    fs.writeFile("UTSanAntonio2_2021_February.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });
  }


  fs.writeFile("UTSanAntonio2_2021_February.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
