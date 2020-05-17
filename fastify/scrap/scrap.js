//instead of puppteer I decide to scrap data with cheerio.
// so I mady a new file and use cheerio to scrap the datas.
const cheerio = require('cheerio');
const request = require('request-promise');

async function scrapFromGithubBefore22(url,country){
	const serial = 	['Aditional information','Province/State','Country/Region','Last Update','Confirmed','Deaths','Recovered','Latitude','Longitude'];
	const bigCountries = ['US', 'Australia','Canada','United Kingdom', 'China'];
	const html = await request(url)
	const $ = cheerio.load(html);
	const tbody = $('table > tbody:nth-child(2)').children();
	const headers = $('.js-csv-data > thead:nth-child(1)').children()[0]
	const keys = $(headers).children();
	if(!bigCountries.includes(country)) {
		const result = [{}]
		let targetTr;
		for(let i=0;i<tbody.length; i++) {
		let targetChild = $(tbody[i]).children()[2];
		let targetChildText = $(targetChild).text();
		if(targetChildText === country) {
			targetTr = $(tbody[i]) ;
			break;
		}
		}
		const tds = targetTr.children(); 
		for(let i=2;i<tds.length;i++) { 
			result[0][$(keys[i]).text()] = $(tds[i]).text()
		}
		return result;
	}
	// if country have separate data.
	const result = [];
	const targetTr = [];

	for(let i=0;i<tbody.length; i++) {
		let targetChild = $(tbody[i]).children()[2];
		let targetChildText = $(targetChild).text();
		if(targetChildText===country){
			targetTr.push($(tbody[i]) );
		}
	}

	for(let i=0;i<targetTr.length;i++){
		result.push({});
		for(let j=1;j<targetTr[i].children().length;j++){
			let allTds = $(targetTr[i]).children()[j];
			let allTdsVal = $(allTds).text()
			result[i][$(keys[j]).text()] = allTdsVal;
		}
	}
	return result;
}


async function scrapFromGithub(url,country){
	const serial = 	['Aditional information','FIPS','Admin2','Province/State','Country/Region','Last Update','Latitude','Longitude','Confirmed','Deaths','Recovered','Active', 'Combined_Key'];
	const bigCountries = ['US', 'Australia','Canada','United Kingdom', 'China']
	const html = await request.get(url)
	const $ = cheerio.load(html);
	const tbody = $('table > tbody:nth-child(2)').children();
	const headers = $('.js-csv-data > thead:nth-child(1)').children()[0]
	const keys = $(headers).children();
	
	// if country doesn't have separeate states data
	if(!bigCountries.includes(country)){
		const result = [{}]
		let targetTr;
		for(let i=0;i<tbody.length; i++) {
		let targetChild = $(tbody[i]).children()[4];
		let targetChildText = $(targetChild).text();
		if(targetChildText === country) {
			targetTr = $(tbody[i]) ;
			break;
		}
		
		}
		const tds = targetTr.children();
		for(let i=4;i<tds.length-1;i++) {
			result[0][$(keys[i]).text()] = $(tds[i]).text()
		}
		return result;
	}

	// if country have separe states data
	const targetTr = [];
	const result = [];

	for(let i=0;i<tbody.length; i++) {
		let targetChild = $(tbody[i]).children()[4];
		let targetChildText = $(targetChild).text();
		if(targetChildText===country) {
			targetTr.push($(tbody[i]) );
		}
	}

	for(let i=0;i<targetTr.length;i++) {
		result.push({});
		for(let j=3;j<targetTr[i].children().length-1;j++){
			let allTds = $(targetTr[i]).children()[j];
			let allTdsVal = $(allTds).text()
			result[i][$(keys[j]).text()] = allTdsVal;
		}
	}
	return result;
}

async function scrapFromWorld(url,country) {
	const serial = ['Country', 'Total Cases', 'New Cases', 'Total Deaths', 'New Deaths', 'Total Recovered', 'Active Cases', 'Serious/Critical', 'Total Cases/1M pop', 'Total Deaths/1M pop','Total Tests', 'Tests/1M pop','Continent'];
	let targetTr;
	const result = [{}];
	const html = await request.get(url);
	const $ = cheerio.load(html);
	const tbody = $('table>tbody:nth-child(2)').children();
	const headers = $('#main_table_countries_today > thead:nth-child(1)').children()[0];
	const keys = $(headers).children()


	for(let i=1; i<tbody.length;i++){
		let targetChild = $(tbody[i]).children()[1];
		let targetChildText = $(targetChild).text();
		if(targetChildText===country){
			targetTr = $(tbody[i]);
			break;
		}
	}
	const tds = targetTr.children();
	for(let i=0;i<tds.length;i++){
		result[0][$(keys[i]).text()] = $(tds[i]).text();
	} 
	return result;
}

async function scrapAllData(url) {
	const serial = ['','Total Cases', 'New Cases', 'Total Deaths', 'New Deaths', 'Total Recovered', 'Active Cases', 'Serious/Critical', 'Total Cases/1M pop', 'Total Deaths/1M pop','Total Tests', 'Tests/1M pop'];
	const result = [{}];
	const html = await request.get(url);
	const $ = cheerio.load(html);
	const targetTr = $('.total_row_body').children()[0];
	const headers = $('#main_table_countries_today > thead:nth-child(1)').children()[0];
	const keys = $(headers).children()
	const tds = $(targetTr).children();
	
	for(let i=1;i<tds.length-1;i++){
		result[0][$(keys[i]).text()] = $(tds[i]).text();
	}
	return result
}



		
module.exports={
	scrapJHU:scrapFromGithub,
	scrapJHUBefore22:scrapFromGithubBefore22,
	scrapWorldoMeters:scrapFromWorld,
	allData:scrapAllData,
}




