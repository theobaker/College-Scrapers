//file for Birmingham-Southern College
// link: https://www.bsc.edu/peoplefinder.html

const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[type ="text"]';
let global_emails = [];

(async () => {

  const browser = await puppeteer.launch({
    headless:true,
    // slowMo: 150,
  });

  const page = await browser.newPage();
  try{
  await page.goto("https://wauplive.bsc.edu/BSC_UI/people_finder_external_lookup.php");
  //await page.waitForSelector(SEARCH_SELECTOR);
  page.waitForNavigation({ waitUntil: 'load' });
  //click on email option
  await page.click('body > form > table > tbody > tr:nth-child(3) > td:nth-child(1) > input[type=radio]')
  await page.click(SEARCH_SELECTOR);
  await page.keyboard.type('bsc');
  await page.keyboard.down('Enter');

  await Promise.race([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.waitForSelector('body > form > table'),
  ]);

  var length = 1730;

  for(var i=2; i<length;i++){
    try{
      console.log("i:", i);
    let showLinkSelector = 'body > form > table > tbody > tr:nth-child('+ i +') > td:nth-child(3) > a';
    await page.click(showLinkSelector);
    await page.waitForSelector('body > form');
    var emails = await page.evaluate(() => {
      var page_emails = [];
      if(document.querySelector('body > form > div > table')!=null){
        if(document.querySelector('body > form > div > table > tbody > tr:nth-child(3) > td:nth-child(2)').innerText.includes("Student")){
          page_emails.push("\n"+
          document.querySelector('body > form > div > table > tbody > tr:nth-child(7) > td:nth-child(2)').innerText);
          page_emails.push("\t"+
          document.querySelector('body > form > div > table > tbody > tr:nth-child(4) > td:nth-child(2)').innerText);
        }
      }
      return page_emails;
    });
    console.log("emails", emails);

    for(var j = 0;j < emails.length;j++){
      global_emails.push(emails[j]);
    }
    await page.goBack();
  }catch{
    fs.writeFile("BirminghamSouthUniversity_2020_November.csv", global_emails, function(error){
      if(error)console.log(error);
    });
  }
  }


  }catch(error){
    console.error(error);
  }
  fs.writeFile("BirminghamSouthUniversity_2020_November.csv", global_emails, function(error){
    if(error)console.log(error);
  });

  console.log("done");
  await browser.close();

  })();
