

const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = '#id_lastname';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];


(async () => {

  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://www.carthage.edu/directory/search/name/");
  await page.click('#id_students');


  for(var x = 23;x < alphabet.length;x++){
      for(var y = 0;y < alphabet.length;y++){
          for(var z = 0;z < alphabet.length;z++){
            let curr = (alphabet[x] + alphabet[y] + alphabet[z]).toString();
            console.log("curr ",curr);
            await page.waitForSelector('#id_lastname');
            if(await page.$('#id_lastname') != null){
                await page.evaluate(() =>
                 document.querySelector("#id_lastname").value = "");
              }
            await page.click(SEARCH_SELECTOR);
            await page.keyboard.type(curr);
            await page.keyboard.down('Enter');

          try{
            await Promise.all([
              page.waitForNavigation({ waitUntil: 'load' }),
              page.waitForSelector('h3.search-results'),
            ]
          );
        }catch(error){
           console.error(error);
        }

            var emails = await page.evaluate(() => {
              var email_id = [];
              var page_emails = [];

              //iterates through each .email and adds them the email array
              email_id = document.querySelectorAll('.email');
              email_id.forEach((element)=>{
                page_emails.push(element.innerText);
              })

              return page_emails;
            });

            console.log("emails", emails);

            for(var i = 0;i < emails.length;i++){
                global_emails.push(emails[i]);
            }
            if(z%10 == 0){
                fs.writeFile("carthage_X.txt", global_emails, function(error){
                if(error)console.log(error);
                    console.log("length:",global_emails.length);
                });
            }
            }

          }

      }
      fs.writeFile("carthage_X.txt", global_emails, function(error){
          if(error)console.log(error);
      });
    }catch(error){
      console.error(error);
    }
      console.log("done");
      console.log("length:",global_emails.length);
      await browser.close();
})();
