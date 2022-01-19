//file for Drexel University
//link: https://drexel.edu/search/?t=student

const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = '#bodytag_2_txtSearch';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];

(async () => {

  const browser = await puppeteer.launch({
    headless:false,
    // slowMo: 100,
  });
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://drexel.edu/search/?t=student");
  await page.waitForSelector(SEARCH_SELECTOR);
  await page.click('#bodytag_2_txtSearch');

  //for loop
  for(var x = 6;x < alphabet.length;x++){
    for(var y = 0;y < alphabet.length;y++){
    let curr = (alphabet[x] + alphabet[y].toString());
    console.log("curr ",curr);
    await page.waitForSelector(SEARCH_SELECTOR);
    if(await page.$(SEARCH_SELECTOR) != null){
        await page.evaluate(() =>
         document.querySelector('#bodytag_2_txtSearch').value = "");
       }

   await page.click(SEARCH_SELECTOR);
   await page.keyboard.type(curr);
   await page.keyboard.down('Enter');

   try{
         await Promise.race([
           page.waitForNavigation({ waitUntil: 'load' }),
           page.waitForSelector('#search-results > table > tbody'),]);
     }catch(error){
        console.error(error);
     }

   if(await page.$('#search-results > table > tbody') != null){
   //click expand all
     await page.waitForSelector('#search-results > a');
     await page.click('#search-results > a');



       var emails = await page.evaluate(() => {
         var email_id = [];
         var page_emails = [];

         email_id = document.querySelectorAll('span.email-address');
         email_id.forEach((element) =>{
               page_emails.push("\n"+ element.querySelector('a').href);
         })
         return page_emails;
       });

       var add_info = await page.evaluate(() => {
         var details_id = [];
         var page_info = [];

         details_id = document.querySelectorAll('span.person-detail');
         details_id.forEach((element) =>{
               page_info.push("\t"+ element.innerText);


         })
         return page_info;
       });

       console.log("emails", emails);

       for(var i = 0;i < emails.length;i++){
         global_emails.push(emails[i]+ add_info[i]);
       }
       if(y%10 == 0){
           fs.writeFile("DrexelUniversity2_2020_November.csv", global_emails, function(error){
             if(error)console.log(error);
             console.log("length:",global_emails.length);
           });
         }
      }
   } //end y

 }//end x

   }catch(error){
     fs.writeFile("DrexelUniversity2_2020_November.csv", global_emails, function(error){
       if(error)console.log(error);
       console.log("length:",global_emails.length);
     });
    console.error(error);
   }

   fs.writeFile("DrexelUniversity2_2020_November.csv", global_emails, function(error){
       if(error)console.log(error);
   });

   console.log("done");
   console.log("length:",global_emails.length);
   await browser.close();
 })();
