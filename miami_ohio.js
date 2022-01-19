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
  for(var x = 798;x < names.length;x++){
    await page.goto("https://community.miamioh.edu/directory/#");
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.click("input[name='nameSearchBox']", {clickCount: 3});
    await page.keyboard.type(curr);
    await page.click("input[Value='Search']");
    //await page.waitForSelector("ol")
    await page.waitFor(1500);
    //Select table and pull emails into email list
    let data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('span'))
      return tds.map(td => td.textContent)
    });
    //data.shift()

    /*for (var i = 0; i<data.length; i++){
      if(i%4==0){
        var email = data[i];
        email = email.replace(/(\r\n|\n|\r)/gm, "");
        email = email.trim();
        emails.push(email);
      }
    }*/

    for (var i = 0; i<data.length; i++){
      if (data[i].includes("@")){
        emails.push(data[i].trim());
      }
    }


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("miamiohio7.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("miamiohio7.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
