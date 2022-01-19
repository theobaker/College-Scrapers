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
  for(var x = 405;x < names.length;x++){
    const curr = names[x]
    for(var y = 1; y <6; y++){
    await page.goto("https://whitepages.ivytech.edu/?first_name=&last_name="+curr+"&userid=&location=all&role=student&title=&bee_syrup_tun=&submit=+Search+&page="+y);
    //await page.click("input#student");
    console.log("x is ",x)
    console.log("curr is ",curr)
    // Type in name and click
    //await page.click("input#last-name");
    //await page.keyboard.type(curr);
    //await page.click("div.input-group-button");
    await page.waitForSelector('tbody');
    await page.waitFor(100);
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      return tds.map(td => td.textContent)
    });

    //for (var i = 0; i<data.length; i++){
    //  if(i%6==4){
    //    var email = data[i];
      //  email = email.replace(/(\r\n|\n|\r)/gm, "");
        //email = email.trim();
        ///emails.push(email+"@uncw.edu");
      //}
    //}

    for (var i = 0; i<data.length; i++){
      if (data[i].includes("@")){
        emails.push(data[i].trim());
      }
    }


    //Below this is good
    //Save
    console.log(emails)

    fs.writeFile("ivytech24.txt", emails, function(error){
      if(error)console.log(error);
      console.log("saved");
    });

  }
}
  fs.writeFile("ivytech24.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
