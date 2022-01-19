// file for Pomona College
//directory link: https://www.pomona.edu/people

const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input.last-name';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];

(async () => {

  const browser = await puppeteer.launch({
    headless:false,
    slowMo: 100,
  });
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://www.pomona.edu/people");
  await page.waitForSelector('#content > div.directory-form-wrapper > form > div.types-wrapper > span:nth-child(3) > input');
  await page.click('#content > div.directory-form-wrapper > form > div.types-wrapper > span:nth-child(3) > input');

  //for loop
  for(var x = 0;x < alphabet.length;x++){
      for(var y = 0;y < alphabet.length;y++){
        let curr = (alphabet[x] + alphabet[y]).toString();
        console.log("curr ",curr);
        await page.waitForSelector(SEARCH_SELECTOR);
        if(await page.$(SEARCH_SELECTOR) != null){
            await page.evaluate(() =>
             document.querySelector('input.last-name').value = "");
           }

       await page.click(SEARCH_SELECTOR);
       await page.keyboard.type(curr);
       await page.keyboard.down('Enter');

       try{
             await Promise.race([
               page.waitForNavigation({ waitUntil: 'load' }),
               page.waitFor(500),]);
         }catch(error){
            console.error(error);
         }

         var emails = await page.evaluate(() => {
           var email_id = [];
           var page_emails = [];

           email_id = document.querySelectorAll('.person');
           email_id.forEach((element) =>{
                 page_emails.push("\n"+ element.querySelector('.email').querySelector('a').href);


           })
           return page_emails;
         });

         console.log("emails", emails);

         for(var i = 0;i < emails.length;i++){
           global_emails.push(emails[i]);
         }
         if(y%10 == 0){
             fs.writeFile("Pomona.csv", global_emails, function(error){
               if(error)console.log(error);
               console.log("length:",global_emails.length);
             });
           }

       }// for loop y
     } //x loop
     fs.writeFile("Pomona.csv", global_emails, function(error){
       if(error)console.log(error);
     });

   }catch(error){
     fs.writeFile("Pomona.csv", global_emails, function(error){
       if(error)console.log(error);});
     console.error(error);
   }

   console.log("done");
   console.log("length:",global_emails.length);
   await browser.close();

   })();
