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
  await page.goto("https://www.dickinson.edu/info/20043/about/1881/campus_directory#/form/people");
  await page.click("input[name='faculty']")
  await page.click("input[name='staff']");
  await page.click("input[name='students']")
  for(var x = 0;x < 1000;x++){
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    await page.click("input#lastName",{clickcount: 3})
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(curr);
    await page.keyboard.type(String.fromCharCode(13));
    await page.waitForSelector('thead');
    //await page.waitFor(3000);
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
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
    if(data[i].includes("@dickinson.edu")){
      emails.push(data[i].trim());
    }
  }

    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("Dickinson_2020_November.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
  fs.writeFile("Dickinson_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
