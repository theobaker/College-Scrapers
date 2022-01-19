const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  fs.readFile('CommonFirst.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  for(var x = 548;x < names.length;x++){
    await page.goto("https://webapps.davidson.edu/Directories/Public/directory_public.aspx");
    await page.waitFor(1500)
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.click("input#rblFind_1")
    await page.waitFor(1500)
    await page.click("input#FirstName")
    await page.keyboard.type(curr);
    await page.click("input#btnFind")
    //await page.waitForSelector('div.media');
    await page.waitForSelector('td');
    await page.waitFor(1500)
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td'))
      return tds.map(td => td.textContent)

    });

    for (var i = 0; i<data.length; i++){
      if(i%6==2){
        if(data[i].length<10){
          var email = curr.slice(0,2)+data[i]+"@davidson.edu";
          emails.push(email);
        }
      }
    }

  /*for (var i = 0; i<data.length; i++){
    if(data[i].includes("@denison.edu")){
      emails.push(data[i].trim());
    }
  }*/

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("Davidson9_2020_November.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("Davidson9_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
