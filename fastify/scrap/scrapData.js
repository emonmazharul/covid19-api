const puppeteer = require('puppeteer');
// for slow internet I have to increase timeout limit.

async function scrapFromWorld(url,yourCountry){
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url,{timeout:600000,waitUntill:'networkidle2'});

	const data = await page.evaluate( (countryName) => {
		const dataSerial = ['Country', 'Total Cases', 'New Cases', 'Total Deaths', 'New Deaths', 'Total Recovered', 'Active Cases', 'Serious/Critical', 'Tot Cases/1M pop', 'Tot Deaths/1M pop'];
		const obj = {};
		const tbody = document.querySelector('#main_table_countries_today > tbody:nth-child(2)').children
		const country = [...tbody].map((item) => item.children[0].textContent);
		const countryNumner  = country.findIndex(item => item === countryName)

		const tr = document.querySelector(`#main_table_countries_today > tbody:nth-child(2) > tr:nth-child(${String(countryNumner+1)})`);
		const td = tr.children;
		for(let i=0; i<td.length; i++){
			obj[dataSerial[i] ] = td[i].textContent;
		}
		return [obj];

	}, yourCountry)

	
	await browser.close();
	return data
}


async function scrapFromGithub(url,country){
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(url,{timeout:600000,waitUntill:'networkidle2'});

		const data = await page.evaluate( (countryName) => {
			const serial = 	['Aditional information','FIPS','Admin2','Province/State','Country/Region','Last Update','Latitude','Longitude','Confirmed','Deaths','Recovered','Active', 'Combined_Key'];
			const  tbody = document.querySelector('.js-csv-data > tbody:nth-child(2)');
			const trs = [...tbody.children];
			const myCountry = trs.filter(tr => tr.children[4].textContent === countryName);
			const allTds = myCountry.map(tr => [...tr.children]);
			const information = []

			for(let i=0 ;i<allTds.length;i++) { 
				information.push({});
				allTds[i].forEach( (td,index) => {
				    information[i][serial[index]] = td.textContent;
				} );
			}	
			return information;

		} ,country )

		await browser.close();
		return data;
}

async function scrapFromGithubBefore22(url,country){
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.goto(url,{timeout:600000,waitUntill:'networkidle2'});

			const data = await page.evaluate( (countryName) => {
				const serial = 	['Aditional information','Province/State','Country/Region','Last Update','Confirmed','Deaths','Recovered','Latitude','Longitude'];
				const  tbody = document.querySelector('.js-csv-data > tbody:nth-child(2)');
				const trs = [...tbody.children];
				const myCountry = trs.filter(tr => tr.children[2].textContent === countryName);
				const allTds = myCountry.map(tr => [...tr.children]);
				const information = []

				for(let i=0 ;i<allTds.length;i++) { 
					information.push({});
					allTds[i].forEach( (td,index) => {
					    information[i][serial[index]] = td.textContent;
					} );
				}	
				return information;

			} ,country )

			await browser.close();
			return data
}


async function allData(url){
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(url,{timeout:600000,waitUntill:'networkidle2'});
		const data = await page.evaluate(() => {
			const dataSerial = ['Total', 'Total Cases', 'New Cases', 'Total Deaths', 'New Deaths', 'Total Recovered', 'Active Cases', 'Serious Cases', 'Tot Cases/1M pop', 'Tot Deaths/1M pop'];
			const obj = {}
			const totalRow = document.querySelector('#main_table_countries_today > tbody:nth-child(3) > tr:nth-child(1)');
			const tds = totalRow.children;
			for(let i=0; i<tds.length; i++){
				obj[dataSerial[i] ] = tds[i].textContent;
			}
			return [obj];

		})
		await browser.close();
		return data;
}

module.exports = {
	scrapJHU:scrapFromGithub,
	scrapJHUBefore22:scrapFromGithubBefore22,
	scrapWorldoMeters:scrapFromWorld,
	allData,
}