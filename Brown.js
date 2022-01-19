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
    await page.goto("https://directory.brown.edu/?rm=advanced&givenname_type=contains&givenname=&sn_type=contains&sn="+curr+"&title_type=contains&title=Undergraduate&ou_type=contains&ou=&telephonenumber_type=contains&telephonenumber=&mail_type=contains&mail=");
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.waitForSelector('div#results');
    await page.waitFor(100);
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('div.email'))
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
      emails.push(data[i].trim());
    }


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("BrownUniversity_2021_July.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("columbia.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
