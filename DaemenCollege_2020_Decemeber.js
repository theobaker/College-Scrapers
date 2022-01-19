//file for Daemen College
//link: http://www.daemen.edu/about/contact-us/directory
const fs = require("fs");
const puppeteer = require('puppeteer');
const base_link = 'http://www.daemen.edu/directory-embed/index_quick_search_photo.php?student_lastname_search_button=Search&lastname_student=';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];


(async () => {

  const browser = await puppeteer.launch({headless:false,slowMo:150});
  const page = await browser.newPage();

  //try, catch to catch any promise rejects
    try{

    //for loop
    for(var x = 0;x < alphabet.length ;x++){
      let curr = (base_link+alphabet[x]).toString();
      console.log("curr ",curr);
      await page.goto(curr);
     try{
           await Promise.race([
             page.waitForNavigation({ waitUntil: 'load' }),
             page.waitForSelector('#directoryResults'),
           ]);
       }catch(error){
          console.error(error);
       }

       var emails = await page.evaluate(() => {
         var email_id = [];
         var page_emails = [];
         email_id = document.querySelectorAll('.individual_person');
         email_id.forEach((element) =>{
            page_emails.push("\n"+ element.querySelector('.dirgeneral')
            .querySelector('a').innerText);
       })
       return page_emails;
     });
     console.log("emails", emails);

     for(var i = 0;i < emails.length;i++){
       global_emails.push(emails[i]);
     }
   }//end for loop
   }catch(error){
     fs.writeFile("DaemenCollege_2020_December.csv", global_emails, function(error){
         if(error)console.log(error);
     });
     console.error(error);
   }
   fs.writeFile("DaemenCollege_2020_December.csv", global_emails, function(error){
   if(error)console.log(error);
   });

   console.log("done");
   await browser.close();
 })();
