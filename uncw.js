const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  fs.readFile('common.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  for(var x = 0;x < names.length;x++){
    await page.goto("https://itsappserv01.uncw.edu/directory/");
    await page.click("input#rdoSearchTable_2");
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.click("input#txtLastName");
    await page.keyboard.type(curr);
    await page.click("input[Value='Search']");
    await page.waitForSelector('tbody');
    await page.waitFor(300);
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('td'))
      return tds.map(td => td.textContent)
    });

    for (var i = 0; i<data.length; i++){
      if(i%6==4){
        var email = data[i];
        email = email.replace(/(\r\n|\n|\r)/gm, "");
        email = email.trim();
        emails.push(email+"@uncw.edu");
      }
    }

    //for (var i = 0; i<data.length; i++){
      //emails.push(data[i]);
    //}


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("uncw.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("uncw.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
