const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto("http://www.hsc.edu/directory-students#G");
  await page.waitForSelector("head");

  //Hacky way of getting 3 lists of last names, first names, and class year
  const lnames = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('div[class="row user-markup"] > p'))
    return tds.map(td => td.getAttribute("data-lastname"))
  });
  const fnames = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('div[class="row user-markup"] > p'))
    return tds.map(td => td.getAttribute("data-firstname"))
  });
  const classyrs = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('div[class="row user-markup"] > p'))
    return tds.map(td => td.getAttribute("data-classcode"))
  });

  //Building the email out of the data points we've got
  for (var i = 0; i<882; i++){
    var fname = fnames[i];
    var lname = lnames[i];
    var year = "default";
    switch (classyrs[i]) {
      case "FR":
        year = "24";
        break;
      case "SO":
        year = "23";
        break;
      case "JR":
        year = "22";
        break;
      case "SR":
        year = "21";
        break;
      default:
        year = "24"
        break;
    }
    var email = lname + fname[0] + year + "@hsc.edu";
    emails.push(email)
  }
  console.log(emails);


  fs.writeFile("HampdenSydney_2020_December.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
