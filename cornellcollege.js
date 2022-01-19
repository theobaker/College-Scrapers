const fs = require("fs");
const puppeteer = require('puppeteer');
const SEARCH_SELECTOR = 'input[name="q"]';
const BUTTON_SELECTOR = 'button[name="btnG"]';
let emails = [];
let names = [];
var alpha = "abcdefghijklmnopqrstuvwxyz";

(async () => {
  fs.readFile('CommonMedium.txt', 'utf8', function (error, data) {
    if (error) throw error;
    names = data.toString().split("\n");
    console.log("names[0] ",names[0])
    console.log("length ",names.length)
  });
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  page.goto("https://www.cornellcollege.edu/directory/index.php/")
  /*for(var x = 2;x < 26;x++){
      for(var y = 0;y < 26;y++){*/
          for(var z = 0;z < names.length;z++){
              //let curr = alpha[x].toString() + alpha[y].toString() + alpha[z].toString();
              let curr = names[z];
              console.log("x is ",z)
              console.log("curr is ",curr)
              page.goto("https://www.cornellcollege.edu/directory/index.php?first_name=&last_name="+curr+"&email=&phone=&building=&search=Search");
              await page.waitForSelector('a');
              //Select table and pull emails into email list
              const data = await page.evaluate(() => {
                const tds = Array.from(document.querySelectorAll('a'))
                return tds.map(td => td.textContent)
              });

              /*for (var i = 0; i<data.length; i++){
                if(i%6==4){
                  var email = data[i];
                  email = email.replace(/(\r\n|\n|\r)/gm, "");
                  email = email.trim();
                  emails.push(email);
                }
              }*/

              for (var i = 0; i<data.length; i++){
                if (data[i].includes("@")){
                  emails.push(data[i]);
                }
              }


              fs.writeFile("cornellcollege2_2020_November.txt", emails, function(error){
                if(error)console.log(error);
                console.log("saved");
              });
              console.log(emails)
            }
          //}
        //}


    //Below this is good
    //Save





  fs.writeFile("cornellcollege2_2020_November.txt", emails, function(error){
      if(error)console.log(error);
  });
  console.log("done");
})();
