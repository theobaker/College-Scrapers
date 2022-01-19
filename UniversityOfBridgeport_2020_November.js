// file for university of Bridgeport
//link: https://www.bridgeport.edu/directory
const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = '#search-input';
//const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];
let names = [];

(async () => {
  fs.readFile('common.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://directorysearch.bridgeport.edu/");

  //for loop
  for(var x = 0;x < names.length;x++){
    // for(var y = 0;y < alphabet.length;y++){
    //   for(var z = 0;z < alphabet.length;z++){
        let curr = names[x];
        console.log("curr ",curr);
        await page.waitForSelector(SEARCH_SELECTOR);
        if(await page.$(SEARCH_SELECTOR) != null){
            await page.evaluate(() =>
             document.querySelector('#search-input').value = "");
           }

        await page.click(SEARCH_SELECTOR);
        await page.keyboard.type(curr);

        try{
              await Promise.all([
                page.waitForNavigation({timeout: 2000 }),
                await page.click('body > div > div > div > div.search-area.row > div.col.col-md-4.col-12.col-sm-12 > button'),
              ]);
          }catch(error){
             //console.error(error);
          }
          var emails = await page.evaluate(() => {
            var email_id = [];
            var page_emails = [];

            email_id = document.querySelectorAll('#search-results > .user-data');
            email_id.forEach((element) =>{
              //if no office -> student
              if(element.querySelector('.user-office').innerText.includes("N/A")){
                //email address
                page_emails.push("\n"+ element.querySelector('.user-email').querySelector('a').href);
                //major
                page_emails.push("\t" + element.querySelector('.user-department').innerText);
              }
            })
            return page_emails;
          });

          console.log("emails", emails);

          for(var i = 0;i < emails.length;i++){
            global_emails.push(emails[i]);
          }
          if(x%10 == 0){
            fs.writeFile("UniversityOfBridgeport_2020_November.csv", global_emails, function(error){
            if(error)console.log(error);
            });
          }
      //   }//end z
      // }//end y
    }//end x

  }catch(error){
    fs.writeFile("UniversityOfBridgeport_2020_November.csv", global_emails, function(error){
        if(error)console.log(error);
    });
    console.error(error);
  }
  fs.writeFile("UniversityOfBridgeport_2020_November.csv", global_emails, function(error){
  if(error)console.log(error);
  });
  console.log("done");
  await browser.close();
})();
