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
  for(var x = 299;x < names.length;x++){
    const curr = names[x]
    await page.goto("https://info.rpi.edu/directory-search/"+curr);
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.waitForSelector('p');
    await page.waitFor(10)
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td[class="views-field views-field-field-email"]'))
      return tds.map(td => td.textContent)
    });

    //for (var i = 0; i<data.length; i++){
      //if(i%6==4){
        //var email = data[i];
        //email = email.replace(/(\r\n|\n|\r)/gm, "");
      //  email = email.trim();
      //  emails.push(email);
    //  }
  //  }

  for (var i = 0; i<data.length; i++){
    if(data[i].includes("@rpi.edu")){
      emails.push(data[i].trim());
    }
  }


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("RPI4_2020_November.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("RPI4_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
