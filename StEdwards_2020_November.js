//file for St.Edwards University
//link: https://www.stedwards.edu/directory/students

const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = '#edit-submit-directory-search';
let global_emails = [];

(async () => {

  const browser = await puppeteer.launch({
    headless:true,
  });
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://www.stedwards.edu/directory/students");
  await page.waitForSelector(SEARCH_SELECTOR);
  await page.click(SEARCH_SELECTOR);
  for(var i=0;i<179;i++){
    await Promise.race([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.waitForSelector('#block-steds-content > div > div'),
    ]);

    var emails = await page.evaluate(() => {
      var email_id = [];
      var page_emails = [];
      email_id = document.querySelectorAll('.views-row');
      email_id.forEach((element) =>{
        page_emails.push("\n"+element.querySelector('.email').querySelector('a').href);
      })
      return page_emails;
    });

    console.log("emails", emails);

    for(var j = 0;j < emails.length;j++){
      global_emails.push(emails[j]);
    }
    //next page
    await page.click('li.pager__item.pager__item--next > a');
  }
  }catch(error){
    console.error(error);
    fs.writeFile("StEdwards_2020_November.csv", global_emails, function(error){
        if(error)console.log(error);
    });
  }
  fs.writeFile("StEdwards_2020_November.csv", global_emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
  await browser.close();
  })();
