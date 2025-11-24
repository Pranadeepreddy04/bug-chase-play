
import { Builder, By, Key, until } from 'selenium-webdriver';
import 'selenium-webdriver/chrome.js';


// How to run this...

async function testButton() {

        
            let driver = await new Builder().forBrowser('chrome').build();

            try {
                // Q: is http the thing we want in here??
                // Q: do we need to naviage specifically to the TTESDUEL page (by default are we on the home page)
                // Navigate to your Node.js application's URL
                await driver.get('http://192.168.1.167:8080/'); // Replace with your app's URL

                // Find the button element (by ID, class name, XPath, etc.)

                // TODO: we need to make the button ultimately be the button in the GAME page (by ID)?
                /// we need to either get (or set if it's not there)

                // buttons we're looking for are:
                /// •	Mark as complete
                /// •	Complete sabotage
                /// •	Give up (repeat the above x5)??


                // Button click structure to make: (first we just want to see if the completeTest button is there)

                // locate each button separately, then click on it using the .click method after

                const button = await driver.wait(until.elementLocated(By.id('startDuel')), 10000); // Replace 'myButton' with your button's ID

                console.log("What does the button say");
                const buttonText = await button.getText();
                console.log(buttonText);


                await button.click();
                // Test print - trying to see what the button says after we get it
                
                // However...let's see if we can find the button for start duel
            }
            finally {
                await driver.quit();
            }

            

        /* finally {
            Driver
        } */


        

        }
    testButton();


