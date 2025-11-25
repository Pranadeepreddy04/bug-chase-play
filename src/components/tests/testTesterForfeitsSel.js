
import { Builder, By, Key, until } from 'selenium-webdriver';
import 'selenium-webdriver/chrome.js';

import assert from 'node:assert';


// How to run this...

// Practice Test function
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
                // ok, so yes, we do have to go to another page for this to be located

                console.log("Trying log log the raw button");
                console.log(button);

                console.log("What does the button say");
                const buttonText = await button.getText();
                console.log(buttonText);

                // test: let's make an assertion for what the button text should say
                assert.strictEqual(buttonText, "Mark as Complete");



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


    // Test Function 1: header page (signed in OR singed out - type: very simple unit test...)

    async function testHeaderPage() {

        let driver = await new Builder().forBrowser('chrome').build();

        // let's store the buttons OUTSIDE the error thing may - so we can still find them after we get an error


        // note: let creates a mutable variable
        let loginButton = null;
        let signoutButton = null;


        try {

            await driver.get('http://192.168.1.167:8080/');
            // First, we're trying to make sure that the header has EITHER login or sign-out on it
            loginButton = await driver.wait(until.elementLocated(By.id('loginButton')), 10000);
            // test: what if one of the buttons is for start duel??
            

            // ok, we found the buttons.
            // big issue though: what if the first button fails. Then, is it possible to get the 2nd one?

            // so maybe we can do a try/catch individually for these??

            

        }
        // I think we need to try to catch errors in here, since we are doing an either-or for the button
        catch (error) {
            // do nothing yet??
        }
        try {
            signoutButton = await driver.wait(until.elementLocated(By.id('signOutButton')), 10000);
        }
        catch (error){

        }


        finally {

            // let's test if the buttons are undefined (but do we need to first store the variable as a loner before we can guarantee printing ability?)
            console.log("In the finally section - here is the login or the signup button (raw buttons);");
            // ok, that worked...so I need a way to SWITCH the context to the header page...

            console.log(loginButton);
            console.log(signoutButton);

            // final step for this test: we want to assert that one of them is not null
            
            // let's create a boolean for this first
            const oneIsNotNull = (loginButton != null) || (signoutButton != null);

            // now, let's try to do an assertTrue
            assert.equal(oneIsNotNull, true);



            await driver.quit();
        }

    }


    //testButton();
    testHeaderPage();


