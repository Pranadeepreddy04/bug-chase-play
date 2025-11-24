import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

async function testButton() {
        let driver = await new Builder().forBrowser('chrome').build();
        try {
            // Navigate to your Node.js application's URL
            await driver.get('http://localhost:3000'); // Replace with your app's URL

            // Find the button element (by ID, class name, XPath, etc.)

            // TODO: we need to make the button ultimately be the button in the GAME page (by ID)?
            const button = await driver.wait(until.elementLocated(By.id('myButton')), 10000); // Replace 'myButton' with your button's ID

            // Click the button
            await button.click();

            // Perform assertions or verify expected changes after clicking the button
            // For example, check for a new element or text change
            const messageElement = await driver.wait(until.elementLocated(By.id('message')), 5000);
            const messageText = await messageElement.getText();
            console.log('Message after button click:', messageText);

        } finally {
            await driver.quit();
        }
    }
    testButton();


