//new file for Illinois Wesleyan university
//link: https://php.iwu.edu/directory/
const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'form[action="students.php"] input[type="text"]';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];


(async () => {

  const browser = await puppeteer.launch({
    headless:true,
   // slowMo: 150,
   });
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://php.iwu.edu/directory/");

  for(var x = 24;x < 26;x++){
      for(var y = 0;y < 23;y++){
          for(var z = 0;z < 23;z++){
            let curr = (alphabet[x] + alphabet[y] + alphabet[z]).toString();
            console.log("curr ",curr);
            try{
            await page.waitForSelector(SEARCH_SELECTOR);
          }catch{
            console.error(error);
            continue;
          }
            if(await page.$('form[action="students.php"] input[type="text"]') != null){
                await page.evaluate(() =>
                 document.querySelector('form[action="students.php"] input[type="text"]').value = "");
              }
            await page.click(SEARCH_SELECTOR);
            await page.keyboard.type(curr);
            await page.keyboard.down('Enter');

            try{
                  await Promise.race([
                    page.waitForNavigation({ waitUntil: 'load' }),
                    page.waitForSelector('ul.long-form.bordered.people'),
                  ]
                );
              }catch(error){
                 console.error(error);
              }
            var emails = await page.evaluate(() => {
              var email_id = [];
              var page_emails = [];

              //iterates through each .contact and adds them the email array
              email_id = document.querySelectorAll('.contact');
              email_id.forEach((element)=>{
                page_emails.push(element.querySelector('a').href);
              })

              return page_emails;
            });

            console.log("emails", emails);

            for(var i = 0;i < emails.length;i++){
                global_emails.push(emails[i]);
            }
            try{
            await page.goBack();
          }catch{
            await page.goto("https://php.iwu.edu/directory/");
          }
            if(z%10 == 0){
                fs.writeFile("IWU_y.txt", global_emails, function(error){
                if(error)console.log(error);
                    console.log("length:",global_emails.length);
                });
            }

          }

        }
      }
      fs.writeFile("IWU_y.txt", global_emails, function(error){
          if(error)console.log(error);
      });
    }catch(error){
      console.error(error);
    }
      console.log("done");
      console.log("length:",global_emails.length);
      await browser.close();
})();
