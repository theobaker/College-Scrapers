//file for Boston College
//link: https://services.bc.edu/publicdirectorysearch/search!displayInput.action

const fs = require("fs");
const puppeteer = require('puppeteer-extra')
const SEARCH_SELECTOR = '#search_input';
let global_emails = [];
let names = [];

// add recaptcha plugin and provide it your 2captcha token
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');


(async () => {
  puppeteer.use(
    RecaptchaPlugin({
      provider: { id: '2captcha', token: 'df4ff11b0deb6a3aee93ce0660c19114' },
      visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    })
  );

  fs.readFile('CommonNames.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("length ",names.length);
  });
  const browser = await puppeteer.launch({
    headless:true,
    defaultViewport: null,
    args:['--start-fullscreen'],
  });
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("https://services.bc.edu/publicdirectorysearch/search!displayInput.action");
    //filter by students
  await page.waitForSelector('#dropdownSearch');
  await page.click('#dropdownSearch');
  await page.click('#search_peopleSearchSelect > li:nth-child(4)');

  //for loop until 3000 bc idk how much money is there
  for(var x = 4700;x < 4800;x++){
    let curr = names[x];
    console.log("curr ",curr);
    console.log("x: ",x);
    await page.waitForSelector(SEARCH_SELECTOR);
    if(await page.$(SEARCH_SELECTOR) != null){
        await page.evaluate((curr) =>{
         document.querySelector('#search_input').value = curr;
        }, curr);
    }
    try{
      await page.solveRecaptchas();
      await page.keyboard.down('Enter');
    }catch(error){
      console.error(error);
    }

    await Promise.race([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.waitForSelector('#directory-search-results'),]);

      //check if there was a next page footer in the bottom
    if(await page.$('tfoot > .footable-paging')){
      await page.click('#tenThousandRows');
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'load' }),
        page.waitForSelector('#directory-search-results'),]);
    }

    var emails = await page.evaluate(() => {
      var email_id = [];
      var page_emails = [];

      email_id = document.querySelectorAll('a');
      email_id.forEach((element) =>{
        if(element.href.includes('@bc.edu') && !(element.href.includes('help'))){
          page_emails.push("\n"+ element.href);
       }
      })
      return page_emails;
    });

    console.log("emails", emails);

    for(var i = 0;i < emails.length;i++){
      global_emails.push(emails[i]);
    }
    if(x%2 == 0){
      fs.writeFile("BostonCollege4700_2020_December.csv", global_emails, function(error){
      if(error)console.log(error);
      });
      console.log("length: ", global_emails.length);
    }
  }
}catch(error){
  fs.writeFile("BostonCollege4700_2020_December.csv", global_emails, function(error){
      if(error)console.log(error);
  });
  console.error(error);
}
fs.writeFile("BostonCollege4700_2020_December.csv", global_emails, function(error){
if(error)console.log(error);
});
console.log("done");
await browser.close();
})();
