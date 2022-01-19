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

  //Iterate through names
  for(var x = 0;x < names.length;x++){
    //Iterate through pages of names
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    for(var i = 0; i < 5; i++){
      try {
        await page.goto("https://www.buffalo.edu/search/search.html?meta_v_and=&meta_peopleDisplayTitle_and=&from-advanced=true&meta_d1day=&query_not=&meta_peopleLastName_and=&meta_peopleAffiliation_and=Student&meta_peopleUBIT_and=&scope=&searchUrl=https%3A%2F%2Fwww.buffalo.edu%2Fsearch%2Fsearch.html&meta_peopleDisplayEmail_and=&meta_d2month=&meta_peopleDisplayPhone_and=&query=&num_ranks=50&meta_d1year=&collection=meta-search&query_phrase_and=&meta_d2day=&meta_f_sand=&sort=&meta_peopleFirstLastName_and="+curr+"&query_and=&form=simple&f.Tabs%7Cdb-people=People&meta_d1month=&meta_d2year=&meta_t=&start_rank="+(i*50).toString());
        await page.waitForSelector('div.search-results-container', {timeout: 10000})
        //Select table and pull emails into email list
        const data = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll('a'))
          return tds.map(td => td.textContent)
        });

        //Push the emails
        for (var n = 0; n<data.length; n++){
          if(data[n].includes("@buffalo.edu") && !data[n].includes(" ")){
            emails.push(data[n].trim());
          }
        }

        console.log(emails)
        fs.writeFile("BuffaloLast_2021_January.txt", emails, function(error){
          if(error)console.log(error);
          console.log("saved");
        });

      } catch(E) {
        console.log("No names");
        continue;
      }
    }

  }
  fs.writeFile("BuffaloLast_2021_January.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
