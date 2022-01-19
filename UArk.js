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
  for(var x = 0;x < names.length;x++){
    const curr = names[x];
    try{
      await page.goto("https://directory.uark.edu/?classification=student&attr=last&match=startswith&search="+curr+"&next=and&attr2=first&match2=is&search2=");
      console.log("x is ",x)
      console.log("curr is ",curr)
      // Wait for data
      await page.waitFor(50)
      await page.waitForSelector('tbody');
    } catch(E){
      console.log("Bad search");
      continue;
    }
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td'))
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
    if(data[i].includes("@uark.edu")){
      emails.push(data[i].trim());
    }
  }


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("Arkansas_2021_January.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("Arkansas_2021_January.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
