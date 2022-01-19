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
  for(var x = 0;x < names.length;x++){
    const curr = names[x]
    await page.goto("https://www.brandeis.edu/directory/run_query?attr=cn&clause=cont&query="+curr+"&limit=Undergraduate");
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.waitForSelector('p');
    await page.waitFor(100);
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a[href]'))
      return tds.map(td => td.getAttribute('href'))
    });

    for (var i = 0; i<data.length; i++){
      if(data[i].includes("choose_user?uid=")){
        var mail = data[i].replace("choose_user?uid=","")
        mail = mail+"@brandeis.edu"
        emails.push(mail);
      }
    }


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("Brandeis_2020_November2.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("Brandeis_2020_November2.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
