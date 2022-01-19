//file for Sewanee university
//link: https://new.sewanee.edu/online-directory/
//new link found embedded in main link: https://new.sewanee.edu/directory/info.php

const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'body > div > form:nth-child(8) > input[type=text]:nth-child(2)';
const alphabet = "abcdefghijklmnopqrstuvwxyz";

let global_emails = [];

(async () => {

  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://new.sewanee.edu/directory/info.php");

  for(var x = 24;x < alphabet.length;x++){
      for(var y = 0;y < alphabet.length;y++){
          for(var z = 0;z < alphabet.length;z++){
            let curr = (alphabet[x] + alphabet[y] + alphabet[z]).toString();
            console.log("curr ",curr);
            await page.waitForSelector(SEARCH_SELECTOR);

            if(await page.$(SEARCH_SELECTOR) != null){
                await page.evaluate(() =>
                 document.querySelector('body > div > form:nth-child(8) > input[type=text]:nth-child(2)').value = "");
               }

            await page.click(SEARCH_SELECTOR);
            await page.keyboard.type(curr);
            await page.keyboard.down('Enter');

            try{
                await Promise.race([
                page.waitForNavigation({ waitUntil: 'load' }),
                page.waitForSelector('body > div > article:nth-child(11)'),
                ]);
              }catch(error){
                 console.error(error);
              }

              var emails = await page.evaluate(() => {
                var email_id = [];
                var page_emails = [];

                email_id = document.querySelectorAll('.topic_description');
                email_id.forEach((element) =>{
                  page_emails.push(element.querySelector('p:nth-child(1)').querySelector('a').href);
                  })
                return page_emails;
              });

              console.log("emails", emails);

              for(var j = 0;j < emails.length;j++){
                global_emails.push(emails[j]);
              }
              if(z%10 == 0){
                  fs.writeFile("Sewaneelast.txt", global_emails, function(error){
                  if(error)console.log(error);
                      console.log("length:",global_emails.length);
                  });
              }
            }
          }
        }//for loop for x
        fs.writeFile("Sewaneelast.txt", global_emails, function(error){
            if(error)console.log(error);
        });
    }catch(error){
      console.error(error);
    }

    console.log("done");
    console.log("length:",global_emails.length);
    await browser.close();

  })();
