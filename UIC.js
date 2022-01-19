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
  for(var x = 367;x < names.length;x++){
    const curr = names[x]
    console.log("x is ",x);
    console.log("curr is ",curr);
    //Go to name page
    try{
      await page.goto("https://www.uic.edu/apps/find-people/search?lastname="+curr+"&firstname=&netid=&department=");
      await page.waitFor(200);
      await page.waitForSelector('tbody');
    } catch(E) {
      console.log("Bad name");
      continue;
    }
    //Select table and pull emails into email list
    const mails = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td > a'))
      return tds.map(td => td.getAttribute('href'))
    });

    const roles = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td'))
      return tds.map(td => td.textContent)
    });
  try{
    for (var i = 0; i<roles.length; i++){
      if(roles[i].includes("Student") && !roles[i].includes("Graduate")){
        var index = ((i-1)/2);
        var unix = mails[index].substring(44,);
        emails.push(unix+"@uic.edu");
      }
    }
  } catch(E) {continue;}


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("UIC2_2021_January.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("UIC2_2021_January.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
