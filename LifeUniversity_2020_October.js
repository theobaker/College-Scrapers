//file for Life University
//link: http://directory.life.edu/Direct.html

const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="searchstring_student"]';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];


(async () => {

  const browser = await puppeteer.launch({headless:true,});
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("http://directory.life.edu/Direct.html");

  for(var x = 0;x < alphabet.length;x++){
      for(var y = 0;y < alphabet.length;y++){


            let curr = (alphabet[x] + alphabet[y]).toString();
            console.log("curr ",curr);
            await page.waitForSelector(SEARCH_SELECTOR);
            if(await page.$(SEARCH_SELECTOR) != null){
                await page.evaluate(() =>
                 document.querySelector('input[name="searchstring_student"]').value = "");
              }
            await page.click(SEARCH_SELECTOR);
            await page.keyboard.type(curr);
            await page.keyboard.down('Enter');

            try{
                  await Promise.race([
                    page.waitForNavigation({ waitUntil: 'load' }),
                    page.waitForSelector('body > center:nth-child(7)'),
                  ]
                );
              }catch(error){
                 console.error(error);
              }

            var emails = await page.evaluate(() => {
              var email_id = [];
              var page_emails = [];

              //iterates through each .contact and adds them the email array
              email_id = document.querySelectorAll('tr');
              email_id.forEach((element)=>{
                if(element.querySelector('td:nth-child(4)')!= null &&
                 element.querySelector('td:nth-child(4)').querySelector('a') != null){
                  page_emails.push(element.querySelector('td:nth-child(4)').querySelector('a').href);
                }
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
              await page.goto("http://directory.life.edu/Direct.html");
            }

          if(y%10 == 0){
              fs.writeFile("life.txt", global_emails, function(error){
              if(error)console.log(error);
                  console.log("length:",global_emails.length);
              });
          }
        }
      }//end first for loop


  fs.writeFile("life.txt", global_emails, function(error){
      if(error)console.log(error);
  });

}catch(error){
  fs.writeFile("life.txt", global_emails, function(error){
      if(error)console.log(error);
  });
  console.error(error);
}
  console.log("done");
  console.log("length:",global_emails.length);
  await browser.close();
})();
