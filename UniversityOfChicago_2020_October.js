// file for University of Chicago
//link: https://directory.uchicago.edu/
const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = '#search_adv_last_name';
const ADVANCED_SEARCH = '#search_basic > div:nth-child(2) > div > a';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];


(async () => {

  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://directory.uchicago.edu/");

  for(var x = 13;x < alphabet.length;x++){
      for(var y = 0;y < alphabet.length;y++){
          for(var z = 0;z < alphabet.length;z++){
            let curr = (alphabet[x] + alphabet[y] + alphabet[z]).toString()+"*";
            console.log("curr ",curr);
            await page.waitForSelector(ADVANCED_SEARCH);
            await page.click(ADVANCED_SEARCH);
            await page.waitForSelector(SEARCH_SELECTOR);
            if(await page.$(SEARCH_SELECTOR) != null){
                await page.evaluate(() =>
                 document.querySelector('#search_adv_last_name').value = "");
               }

            await page.click(SEARCH_SELECTOR);
            await page.keyboard.type(curr);
            await page.keyboard.down('Enter');

            try{
                  await Promise.race([
                    page.waitForNavigation({ waitUntil: 'load' }),
                    // page.waitForSelector('#bottomrow > div > div > div > div > table'),
                  ]
                );
              }catch(error){
                 console.error(error);
                 await page.goto("https://directory.uchicago.edu/");
              }
              //if table of results isn't null

              if(await page.$('#bottomrow > div > div > div > div > table')!= null){
                try{
                  var emails = await page.evaluate(() => {
                    var email_id = [];
                    var page_emails = [];

                    email_id = document.querySelector('#bottomrow > div > div > div > div > table > tbody').
                    querySelectorAll('tr');
                    email_id.forEach((element) =>{
                      //if no title -> student
                      if(element.querySelector('td:nth-child(2)').innerText != null){
                        if(element.querySelector('td:nth-child(2)').innerText == ""){
                          page_emails.push("\n"+ element.querySelector('td:nth-child(3)').querySelector('a').href);
                        }
                      }
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
                    fs.writeFile("UChicagoN.csv", global_emails, function(error){
                      if(error)console.log(error);
                      console.log("length:",global_emails.length);
                    });

                }
              } //end of if
              try{
              await page.goBack();
            }catch{
              await page.goto("https://directory.uchicago.edu/");
            }
            }// z loop
          } // y loop
        }// x loop
        fs.writeFile("UChicagoN.csv", global_emails, function(error){
          if(error)console.log(error);
        });
  }catch(error){
    fs.writeFile("UChicagoN.csv", global_emails, function(error){
      if(error)console.log(error);
    });
    console.error(error);
  }

  console.log("done");
  console.log("length:",global_emails.length);
  await browser.close();

  })();
