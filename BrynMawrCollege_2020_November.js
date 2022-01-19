//file for Bryn Mawr College
//link: http://bascom.brynmawr.edu/find/student/index.html

const fs = require("fs");
const puppeteer = require('puppeteer');
let global_emails = [];

(async () => {

  const browser = await puppeteer.launch({
    headless:false,
    slowMo: 150,
  });
  const page = await browser.newPage();
  try{
  await page.goto("http://bascom.brynmawr.edu/find/student/index.html");
  await page.waitForSelector('input[value = "Search"]');
  await page.click('input[value = "Search"]');

  await Promise.race([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.waitForSelector('.two-thirds'),
  ]);

  var emails = await page.evaluate(() => {
    var email_id = [];
    var page_emails = [];
    email_id = document.querySelectorAll('.username');
    email_id.forEach((element) =>{
      page_emails.push("\n" + element.innerText + "@brynmawr.edu");
    })
    return page_emails;
  });

  for(var i = 0;i < emails.length;i++){
    global_emails.push(emails[i]);
  }

  }catch(error){
    console.error(error);
  }

  fs.writeFile("BrynMawrCollege_2020_November.csv", global_emails, function(error){
    if(error)console.log(error);
  });

  console.log("done");
  console.log("length:",global_emails.length);
  await browser.close();

  })();
