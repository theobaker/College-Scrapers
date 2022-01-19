//file for Pacific Lutheran University
//link: https://search.plu.edu/people.php?q

const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = '#search_keywords';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];

(async () => {

  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://search.plu.edu/people.php?q");

  //select students
  await page.select('#search_box > select', 'stu');
  //for loop
  for(var x = 23;x < alphabet.length;x++){
    for(var y = 0;y < alphabet.length;y++){
      for(var z = 0; z <alphabet.length; z++){
        let curr = (alphabet[x] + alphabet[y] + alphabet[z].toString());
        console.log("curr ",curr);
        await page.waitForSelector(SEARCH_SELECTOR);
        if(await page.$(SEARCH_SELECTOR) != null){
            await page.evaluate(() =>
             document.querySelector('#search_keywords').value = "");
           }

         await page.click(SEARCH_SELECTOR);
         await page.keyboard.type(curr);
         await page.keyboard.down('Enter');

         try{
            await Promise.race([
               page.waitForNavigation({ waitUntil: 'load' }),
               page.waitForSelector('#content_main > table'),]);
         }catch(error){
            console.error(error);
           }
        try{
         var emails = await page.evaluate(() => {
           var email_id = [];
           var page_emails = [];

           email_id = document.querySelectorAll('#content_main > table > tbody > tr');
           email_id.forEach((element) =>{
                 page_emails.push("\n"+ element.querySelector('td:nth-child(4)').querySelector('a').href);
           })
           return page_emails;
         });
       }catch(error){
         console.error(error);
       }

         console.log("emails", emails);

         for(var i = 0;i < emails.length;i++){
           global_emails.push(emails[i]);
         }
         if(z%10 == 0){
             fs.writeFile("PLUX.csv", global_emails, function(error){
               if(error)console.log(error);
               console.log("length:",global_emails.length);
             });
           }
       }//for loop z
      }// for loop y
     } //x loop

     fs.writeFile("PLUX.csv", global_emails, function(error){
       if(error)console.log(error);
     });

   }catch(error){
     console.error(error);
   }

   console.log("done");
   console.log("length:",global_emails.length);
   await browser.close();

   })();
