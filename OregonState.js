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
    console.log("x is ",x)
    console.log("curr is ",curr)

    try{
      await page.goto("http://directory.oregonstate.edu/?type=search&cn=&surname="+curr+"&mail=&telephonenumber=&osualtphonenumber=&osuofficeaddress=&osudepartment=&affiliation=student&anyphone=");
      await page.waitFor(200);
      await page.waitForSelector("div#records", {timeout: 10000});
    } catch(E) {
      console.log("Bad Name");
      continue;
    }
    // Type in name and click
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.textContent)
    });

  for (var i = 0; i<data.length; i++){
    if(data[i].includes("@oregonstate.edu")){
      emails.push(data[i]);
    }
  }

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("OregonState_2021_February.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("OregonState_2021_February.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
