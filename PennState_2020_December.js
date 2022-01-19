//file for Penn State University
//link: http://www.work.psu.edu/ldap/

const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = '#sn';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let global_emails = [];


(async () => {

  const browser = await puppeteer.launch({headless:false, slowMo:150});
  const page = await browser.newPage();

//try, catch to catch any promise rejects
  try{
  await page.goto("http://www.work.psu.edu/ldap/");
  //click full listing
  await page.waitForSelector('#full');
  await page.click('#full');

//for loop
for(var x = 0;x < alphabet.length;x++){
  for(var y = 0;y < alphabet.length;y++){
  let curr = (alphabet[x] + alphabet[y] +'*').toString();
  console.log("curr ",curr);
  await page.waitForSelector(SEARCH_SELECTOR);
  if(await page.$(SEARCH_SELECTOR) != null){
      await page.evaluate((curr) => {
       document.querySelector('#sn').value = curr;
     },curr);
   }
   await page.keyboard.down('Enter');

   await Promise.race([
     page.waitForNavigation({ waitUntil: 'load' }),
     page.waitForSelector('body > div'),
   ]);

   var emails = await page.evaluate(() => {
     var table = [];
     var tr = [];
     var flag = false;
     var page_emails = [];
     table = document.querySelectorAll('tbody');

     table.forEach((element) =>{
       tr = element.querySelectorAll('td');
       tr.forEach((e) => {

         if(e.innerText.includes(' STUDENT')){
           flag = true;
           //add title to list
          page_emails.push(e.innerText);
         }

       })
       //if this table is about a student, add them to list
       if(flag==true){
         page_emails.push(element.querySelector('a').href);
       }
       //revert flag to false
       flag=false;
   })
   return page_emails;
 });
 console.log("emails", emails);
 for(var i = 0;i < emails.length;i++){
   global_emails.push(emails[i]);
 }
 //go back
 page.goBack();
 if(y%10 == 0){
   fs.writeFile("PennState_2020_December.csv", global_emails, function(error){
   if(error)console.log(error);
   console.log("length:",global_emails.length);
    });
  }
  }
}
 fs.writeFile("PennState_2020_December.csv", global_emails, function(error){
     if(error)console.log(error);
 });
}catch(error){
  fs.writeFile("PennState_2020_December.csv", global_emails, function(error){
      if(error)console.log(error);
  });
  console.error(error);
}
console.log("done");
await browser.close();
})();
