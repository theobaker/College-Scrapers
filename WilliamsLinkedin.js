const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];
const alph = "abcdefghijklmnopqrstuvwxyz";
function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}


(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin")
  await page.waitForSelector("input#username")
  await page.click("input#username")
  await page.keyboard.type("")//Put login email here
  await page.click("input#password")
  await page.keyboard.type("")//Put Linkedin password here
  await page.waitFor(2000)
  await page.click("button[type='submit']")
  await page.waitFor(2000)

  await page.goto("https://www.linkedin.com/school/williams-college/people/?educationEndYear=2024&educationStartYear=2021")
  await page.waitForSelector("div.artdeco-card")
  await page.setViewport({
        width: 1200,
        height: 800
    });
  for (var n = 0; n<100; n++){
    await autoScroll(page);
    await page.waitFor(2000)
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      //console.log(tds)
      return tds.map(td => td.getAttribute("href"))
    });

    for (var i = 0; i<data.length; i+=2){
      if(data[i].includes("/in/")){
        var email = data[i].trim();
        var index = getPosition(email,'-',2)
        email = email.slice(4,index);
        for (var z = 0; z<26; z++){
          var letter = alph[z].toString();
          var email2=email.replace("-","."+letter+".")
          emails.push(email2+"@williams.edu");
        }
      }
    }
    console.log(emails)
    fs.writeFile("WilliamsLinkedin_2020_December.csv", emails, function(error){
        if(error)console.log(error);
    });
  }





  /*
  for(var x = 0;x < 1000;x++){
    const curr = names[x]
    console.log("x is ",x)
    console.log("curr is ",curr)
    await page.goto("https://www.bu.edu/phpbin/directory/?q="+curr);
    try {
      await page.waitForSelector("li")
    } catch(e) {
      console.log("Continue")
    }
    await page.waitFor(5000)
    //Get individual pages
    const links = await page.evaluate(() => {
      let elements = $('dd.first').toArray();
      return links
    });
    //Go to these pages
    for (i = 0; i < links.length; i++) {
      $(links[i]).click();
      await page.waitFor(5000)
    }
    //Select table and pull emails into email list
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('a'))
      //console.log(tds)
      return tds.map(td => td.textContent)
    });

    for (var i = 0; i<data.length; i++){
      var email = data[i];
      emails.push(email);
    }

  /*for (var i = 0; i<data.length; i++){
    if(data[i].includes("@denison.edu")){
      emails.push(data[i].trim());
    }
  }*/


  fs.writeFile("WilliamsLinkedin_2020_December.csv", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
