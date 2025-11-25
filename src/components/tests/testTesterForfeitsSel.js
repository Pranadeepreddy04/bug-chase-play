
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

        // Create a double try-catch block to catch each exception separately
        try {
            await driver.get('http://192.168.1.167:8080/');
            loginButton = await driver.findElement(By.id('loginButton'));
        }
        // I think we need to try to catch errors in here, since we are doing an either-or for the button
        catch (error) {
            console.log("Login not found");
        }
        try {
            //signoutButton = await driver.wait(until.elementLocated(By.id('signOutButton')), 10000);
            signoutButton = await driver.findElement(By.id('signOutButton'));
        }
        catch (error){
            console.log("Sign-out not found");
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

    // Test 2: the basic tester-gives-up
    async function testerGivesUp() {

        let driver = await new Builder().forBrowser('chrome').build();

        // important prereq for thsis: we need to make sure we are LOGGED IN on the home page
        // let's see if we log in on chrome, whether it works


        try {
		    await driver.get('http://192.168.1.167:8080/duel'); 
            // do the login
            const emailField = await driver.findElement(By.id('email')); // Or By.name, By.css, By.xpath
            await emailField.sendKeys('jkoplik@albany.edu'); // Replace with actual username
            const passwordField = await driver.findElement(By.id('password')); // Or By.name, By.css, By.xpath
            // password redacted
            await passwordField.sendKeys('########');


            const startTestDuelButton = await driver.wait(until.elementLocated(By.id('startTestDuelButton')), 3000);
            startTestDuelButton.click();
            
            // Do all the following 5 times
            // Mark Complete (completeTestsButton)
            // compelte sabotage (completeSabotage)
            // then give up (giveUpButton)
            for (let i = 0; i < 5; i++) {
                const completeTestsButton = await driver.wait(until.elementLocated(By.id('completeTestsButton')), 3000);
                completeTestsButton.click();
                const completeSabotageButton = await driver.wait(until.elementLocated(By.id('completeSabotageButton')), 3000);
                completeSabotageButton.click();
                const giveUpButton = await driver.wait(until.elementLocated(By.id('giveUpButton')), 3000);
                giveUpButton.click();


            }

            // at the end of this, we need to assert that the saboteur has won
            // id is winnerCelebration
            const winnerCelebration = await driver.wait(until.elementLocated(By.id('winnerCelebration')), 3000);
            // now, what can we get from the winner celebration? (ok, maybe the winner...)
            const winner = winnerCelebration.getAttribute("winner");
            // now, we must make sure that the winner is the SABORTUER
            assert.strictEqual(winner, "saboteur");
        }
        finally {
            await driver.quit();
        }

    }

    // Test 3: the basic tester-gives-up, but they also put in an off-by-one error

    async function testerGivesUp2() {
        

        let driver = await new Builder().forBrowser('chrome').build();

        // important prereq for thsis: we need to make sure we are LOGGED IN on the home page
        // let's see if we log in on chrome, whether it works


        try {
		    await driver.get('http://192.168.1.167:8080/duel'); 
            // do the login
            const emailField = await driver.findElement(By.id('email')); // Or By.name, By.css, By.xpath
            await emailField.sendKeys('jkoplik@albany.edu'); // Replace with actual username
            const passwordField = await driver.findElement(By.id('password')); // Or By.name, By.css, By.xpath
            // password redacted
            await passwordField.sendKeys('########');


            const startTestDuelButton = await driver.wait(until.elementLocated(By.id('startTestDuelButton')), 3000);
            startTestDuelButton.click();

            // only difference from the above function: once we get into the duel page, we need to apply the off-by-one error
            const offByOneButton = await driver.findElement(By.Key('off-by-one'));
            const applyButton = offByOneButton.getAttribute("applyError");



            
            // Do all the following 5 times
            // Mark Complete (completeTestsButton)
            // compelte sabotage (completeSabotage)
            // then give up (giveUpButton)
            for (let i = 0; i < 5; i++) {
                const completeTestsButton = await driver.wait(until.elementLocated(By.id('completeTestsButton')), 3000);
                completeTestsButton.click();
                const completeSabotageButton = await driver.wait(until.elementLocated(By.id('completeSabotageButton')), 3000);
                completeSabotageButton.click();
                const giveUpButton = await driver.wait(until.elementLocated(By.id('giveUpButton')), 3000);
                giveUpButton.click();


            }

            // at the end of this, we need to assert that the saboteur has won
            // id is winnerCelebration
            const winnerCelebration = await driver.wait(until.elementLocated(By.id('winnerCelebration')), 3000);
            // now, what can we get from the winner celebration? (ok, maybe the winner...)
            const winner = winnerCelebration.getAttribute("winner");
            // now, we must make sure that the winner is the SABORTUER
            assert.strictEqual(winner, "saboteur");
        }
        finally {
            await driver.quit();
        }
    }







    //testButton();
    testHeaderPage();
    //testerGivesUp();


