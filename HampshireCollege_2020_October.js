//file for Hampshire College
//link: https://directory.hampshire.edu/
const fs = require("fs");
const puppeteer = require('puppeteer');
let global_emails = [];

(async () => {

  const browser = await puppeteer.launch({
    headless:false,
    slowMo: 150,
  });
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://directory.hampshire.edu/");
  await page.waitForSelector('#HC_dept');
  await page.select('select#HC_dept','ALLSTU');

  for(var i =0; i<20;i++){
    await Promise.race([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.waitForSelector('#txtPERSON'),
    ]);
    var emails = await page.evaluate(() => {
      var email_id = [];
      var page_emails = [];
      email_id = document.querySelectorAll('#txtPERSON > ul');
      email_id.forEach((element) =>{
        page_emails.push(element.querySelector('li:nth-child(1)').querySelector('a').href);
      })
      return page_emails;
    });


    console.log("emails", emails);

    for(var j = 0;j < emails.length;j++){
      global_emails.push(emails[j]);
    }
    //next page
    if(i == 0){
      await page.click('#txtPERSON > p > a');
    }else{
      await page.click('#txtPERSON > p > a:nth-child(2)');
    }

  }
  }catch(error){
    console.error(error);
  }

  fs.writeFile("Hampshire.txt", global_emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
  console.log("length:",global_emails.length);
  await browser.close();
})();
