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
  for(var x = 161;x < names.length;x++){
    const curr = names[x]
    await page.goto("https://people.wright.edu/search/people/"+curr+"?name_field=cn&precision=contains&wsurole%5BStudent%5D=Student&wsurole%5BFaculty%5D=0&wsurole%5BStaff%5D=0");
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    try{
      await page.waitFor(200);
      await page.waitForSelector('li.search-result', {timeout: 10000});
    } catch(E) {
      console.log("Bummer");
      continue;
    }

    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.textContent)
    });

    for (var i = 0; i<data.length; i++){
      if(data[i].includes("@wright.edu")){
        emails.push(data[i]);
      }
    }

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("WrightState5_2021_February.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("WrightState5_2021_February.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
