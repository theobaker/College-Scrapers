//file for College of St. Scholastica
//link: https://www2.css.edu/directory/

const fs = require("fs");
const puppeteer = require('puppeteer-extra')
const SEARCH_SELECTOR = '#fname';
let global_emails = [];
const alphabet = "abcdefghijklmnopqrstuvwxyz";

// add recaptcha plugin and provide it your 2captcha token
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

(async () => {
  puppeteer.use(
    RecaptchaPlugin({
      provider: { id: '2captcha', token: 'df4ff11b0deb6a3aee93ce0660c19114'},
      visualFeedback: true //colorize reCAPTCHAs (violet = detected, green = solved)
    })
  );

  const browser = await puppeteer.launch({
    headless:true,
    defaultViewport: null,
    args:['--start-fullscreen'],
  });
  const page = await browser.newPage();
  try{
  await page.goto("https://www2.css.edu/directory/");

  for(var x = 22;x < alphabet.length;x++){
    for(var y = 0;y < alphabet.length;y++){
      let curr = (alphabet[x] + alphabet[y]).toString();
      console.log("curr ",curr);
      await page.waitForSelector(SEARCH_SELECTOR);
      //click on student tab
      await page.click('#studOpt');
      if(await page.$(SEARCH_SELECTOR) != null){
        await page.evaluate((curr) =>{
         document.querySelector('#fname').value = curr;
        }, curr);
    }

    await page.solveRecaptchas();
    await page.click('#submit');

    await Promise.race([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.waitForSelector('#inside-content > div > div > article > div.card'),]);

      var emails = await page.evaluate(() => {
        var email_id = [];
        var page_emails = [];

        email_id = document.querySelectorAll('p');
        email_id.forEach((element) =>{
          if(element.innerText.includes('@css.edu')){
            page_emails.push("\n"+ element.innerText);
         }
        })
        return page_emails;
      });
      console.log("emails", emails);

      for(var i = 0;i < emails.length;i++){
        global_emails.push(emails[i]);
      }
      page.goBack();
      if(y%2 == 0){
        fs.writeFile("CollegeofStScholasticaW_2020_December.csv", global_emails, function(error){
        if(error)console.log(error);
        });
        console.log("length: ", global_emails.length);
      }
    }
  }

  }catch(error){
    fs.writeFile("CollegeofStScholasticaW_2020_December.csv", global_emails, function(error){
        if(error)console.log(error);
    });
    console.error(error);
  }
  fs.writeFile("CollegeofStScholasticaW_2020_December.csv", global_emails, function(error){
  if(error)console.log(error);
  });
  console.log("done");
  await browser.close();

  })();
