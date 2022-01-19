// file for Syracuse university
//link: http://directory.syr.edu/directory/dir.cfm
const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = '#search_last';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];


(async () => {

  const browser = await puppeteer.launch({headless:true,});
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("http://directory.syr.edu/directory/dir.cfm");

//for loop
  for(var x = 10;x < alphabet.length;x++){
      for(var y = 0;y < alphabet.length;y++){
          for(var z = 0;z < alphabet.length;z++){
            let curr = (alphabet[x] + alphabet[y] + alphabet[z]).toString();
            console.log("curr ",curr);
            await page.waitForSelector(SEARCH_SELECTOR);
            if(await page.$(SEARCH_SELECTOR) != null){
                await page.evaluate(() =>
                 document.querySelector('#search_last').value = "");
               }

            await page.click(SEARCH_SELECTOR);
            await page.keyboard.type(curr);
            await page.keyboard.down('Enter');

            try{
                  await Promise.race([
                    page.waitForNavigation({ waitUntil: 'load' }),
                    page.waitForSelector('#middle-column > div > table:nth-child(2)'),
                  ]
                );
              }catch(error){
                 console.error(error);
              }


            var emails = await page.evaluate(() => {
              var email_id = [];
              var page_emails = [];
              var acceptable = ["Freshman","Sophomore","Junior","Senior"];
              email_id = document.querySelectorAll(' #middle-column > div > table:nth-child(2) > tbody >tr');
              email_id.forEach((element) =>{
                if(element.querySelector('td:nth-child(3)')){
                  acceptable.forEach((term) =>{

                    if(element.querySelector('td:nth-child(3)').textContent.includes(term)
                      && element.querySelector('td:nth-child(1)').querySelector('a') != null){
                      page_emails.push(element.querySelector('td:nth-child(1)').querySelector('a').href +
                       "-" + element.querySelector('td:nth-child(3)').textContent);
                    }
                  })
                }
              })
              return page_emails;
            });

            console.log("emails", emails);

            for(var i = 0;i < emails.length;i++){
              global_emails.push(emails[i]);
            }

            const NEXT_SELECTOR = '#form > table > tbody > tr > td:nth-child(2) >input#direction';

            //if there more than one page
            if(await page.$(NEXT_SELECTOR)!= null){
              //go to the next page until there are no more next pages
              for(var j=0;j<2;j++){

                if(await page.$(NEXT_SELECTOR)!= null){
                  page.waitForSelector(NEXT_SELECTOR);
                  page.waitForNavigation({ waitUntil: 'load' });
                var emails = await page.evaluate(() => {
                  var email_id = [];
                  var page_emails = [];
                  var acceptable = ["Freshman","Sophomore","Junior","Senior"];
                  email_id = document.querySelectorAll(' #middle-column > div > table:nth-child(2) > tbody >tr');
                  email_id.forEach((element) =>{
                    if(element.querySelector('td:nth-child(3)')){
                      acceptable.forEach((term) =>{

                        if(element.querySelector('td:nth-child(3)').textContent.includes(term)
                          && element.querySelector('td:nth-child(1)').querySelector('a') != null){
                          page_emails.push(element.querySelector('td:nth-child(1)').querySelector('a').href +
                           "-" + element.querySelector('td:nth-child(3)').textContent);
                        }
                      })
                    }
                  })
                  return page_emails;
                });

                console.log("emails", emails);

                for(var i = 0;i < emails.length;i++){
                    global_emails.push(emails[i]);
                }

              }
            }//end for
          }//end if
          if(z%10 == 0){
              fs.writeFile("SyracuseK.txt", global_emails, function(error){
              if(error)console.log(error);
                  console.log("length:",global_emails.length);
              });
            }
          }//end z
        }//end y
      }//end x
      fs.writeFile("SyracuseK.txt", global_emails, function(error){
          if(error)console.log(error);
      });
    }catch(error){
      console.error(error);
    }
    console.log("done");
    console.log("length:",global_emails.length);
    await browser.close();
  })();
