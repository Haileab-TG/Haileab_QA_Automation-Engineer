const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')({ sigint: true });

async function loginAndSelectThreeRandomItmes() {
	// Getting Username and password from user
	console.log('Enter username');
	const userName = prompt('> ');
	console.log('Enter password');
	const password = prompt('> ');

	// Opening Chromium browser
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	// Navigating to the sauceDemo and waiting page to load
	await Promise.all([
		page.goto('https://www.saucedemo.com/'),
		page.waitForNavigation(),
	]);

	// providing login credentials into text input a
	await page.type('#user-name', userName);
	await page.type('#password', password);

	//clicking login button and getting any login error
	await page.click('#login-button');
	loginError = await page.evaluate(() => {
		let el = document.querySelector('.error-message-container');
		return el ? el.textContent : null;
	});

	// logging login Error
	if (loginError) {
		console.log('\nLOGIN FAILED:', loginError);
		browser.close();
	} else { //proceeding with the process after successful login

		//waiting the next page after login to load
		await page.waitForSelector('.inventory_item_price');

		// getting all the add to cart buttons to sample 3 random items to select
		const buttons = await page.$x("//button[contains(text(), 'Add to cart')]");

		// going through the buttons and selecting 3 random items while handling faulty buttons
		let itemsAdded = 0;
		while (itemsAdded < 3) {
			try {
				await buttons[Math.floor(Math.random() * buttons.length)].click();
			} catch (e) {

      } finally {
				itemsAdded = parseInt(
					await page.evaluate(() => {
						let el = document.querySelector('.shopping_cart_badge');
						return el ? el.textContent : 0;
					})
				);
			}
		}


    // successful process execution feedback
		console.log('\n\nResult-->');
		console.log('SUCCESS: 3 random items has been added to cart!\n');
		console.log(
			'Go head to the popped up Chromium to see the 3 selected items!\n\n'
		);
		console.log('Press [Enter] to close the browser and program');
		prompt('> ');
    
    //closing the browser
		await browser.close();
	}
}

loginAndSelectThreeRandomItmes();
