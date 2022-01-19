// file for Nazareth College
//link: https://directories.naz.edu/
const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = '#search-query';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];


(async () => {

  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://directories.naz.edu/");

  for(var x = 0;x < alphabet.length;x++){
    for(var y = 0;y < alphabet.length;y++){
      for(var z = 0;z < alphabet.length;z++){
        let curr = (alphabet[x] + alphabet[y] + alphabet[z]).toString();
        console.log("curr ",curr);
        await page.waitForSelector(SEARCH_SELECTOR);
        if(await page.$(SEARCH_SELECTOR) != null){
            await page.evaluate(() =>
             document.querySelector('#search-query').value = "");
           }

        await page.click(SEARCH_SELECTOR);
        await page.keyboard.type(curr);
        await page.click('#search-button');

        try{
              await Promise.race([
                page.waitForNavigation({ waitUntil: 'load' }),
                page.waitForSelector('#column-main'),]);
          }catch(error){
             console.error(error);
          }

          var emails = await page.evaluate(() => {
            var email_id = [];
            var page_emails = [];

            email_id = document.querySelectorAll('#student-results-slot > [id^="student-"]');
            email_id.forEach((element) =>{
              console.log("inside");
              page_emails.push("\n"+ element.querySelector('dl > dd').querySelector('a').href);
            })
            return page_emails;
          });

          console.log("emails", emails);

          for(var i = 0;i < emails.length;i++){
            global_emails.push(emails[i]);
          }
          if(z%10 == 0){
              fs.writeFile("NazarethCollege_2020_November.csv", global_emails, function(error){
              if(error)console.log(error);
                  console.log("length:",global_emails.length);
              });
            }
        } //end z
      }// end y
    } //end x
    fs.writeFile("NazarethCollege_2020_November.csv", global_emails, function(error){
        if(error)console.log(error);
    });
  }catch(error){
    fs.writeFile("NazarethCollege_2020_November.csv", global_emails, function(error){
        if(error)console.log(error);
    });
    console.error(error);
  }
  console.log("done");
  await browser.close();
})();
