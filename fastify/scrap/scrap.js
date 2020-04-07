//instead of puppteer I decide to scrap data with cheerio.
// so I mady a new file and use cheerio to scrap the datas.
const cheerio = require('cheerio');
const request = require('request-promise');

async function scrapFromGithubBefore22(url,country){
	const html = await request(url)
	const $ = cheerio.load(html);
	const tbody = $('table > tbody:nth-child(2)').children();
	const targetTr = [ ]
	const serial = 	['Aditional information','Province/State','Country/Region','Last Update','Confirmed','Deaths','Recovered','Latitude','Longitude'];
	const result = [];

	for(let i=0;i<tbody.length; i++) {
		let targetChild = $(tbody[i]).children()[2];
		let targetChildText = $(targetChild).text();
		if(targetChildText===country){
			targetTr.push($(tbody[i]) );
		}
	}

	for(let i=0;i<targetTr.length;i++){
		result.push({});
		for(let j=0;j<targetTr[i].children().length;j++){
			let allTds = $(targetTr[i]).children()[j];
			let allTdsVal = $(allTds).text()
			result[i][serial[j]] = allTdsVal;
		}
	}
	return result
}


async function scrapFromGithub(url,country){
	const html = await request.get(url)
	const $ = cheerio.load(html);
	const tbody = $('table > tbody:nth-child(2)').children();
	const targetTr = [ ]
	const serial = 	['Aditional information','FIPS','Admin2','Province/State','Country/Region','Last Update','Latitude','Longitude','Confirmed','Deaths','Recovered','Active', 'Combined_Key'];
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
		for(let j=0;j<targetTr[i].children().length;j++){
			let allTds = $(targetTr[i]).children()[j];
			let allTdsVal = $(allTds).text()
			result[i][serial[j]] = allTdsVal;
		}
	}
	return result;
}

async function scrapFromWorld(url,country) {
	const serial = ['Country', 'Total Cases', 'New Cases', 'Total Deaths', 'New Deaths', 'Total Recovered', 'Active Cases', 'Serious/Critical', 'Total Cases/1M pop', 'Total Deaths/1M pop','Total Tests', 'Tests/1M pop'];
	const targetTr = [];
	const result = [];
	const html = await request.get(url);
	const $ = cheerio.load(html);
	const tbody = $('table>tbody:nth-child(2)').children();

	for(let i=0; i<tbody.length;i++){
		let targetChild = $(tbody[i]).children()[0];
		let targetChildText = $(targetChild).text();
		if(targetChildText===country){
			targetTr.push($(tbody[i]));
			break;
		}
	}

	for(let i=0;i<targetTr.length;i++){
			result.push({});
			for(let j=0;j<targetTr[i].children().length;j++){
				// console.log(target[i].children());
				let allTds = $(targetTr[i]).children()[j];
				let allTdsVal = $(allTds).text()
				result[i][serial[j]] = allTdsVal;
			}
		}
	return result;
}

async function scrapAllData(url) {
	const serial = ['Country/Reason', 'Total Cases', 'New Cases', 'Total Deaths', 'New Deaths', 'Total Recovered', 'Active Cases', 'Serious/Critical', 'Total Cases/1M pop', 'Total Deaths/1M pop','Total Tests', 'Tests/1M pop'];
	const result = [];
	const html = await request.get(url);
	const $ = cheerio.load(html);
	const tbody = $('table>tbody:nth-child(2)').children();
	const matchTr = $(tbody[0])
	const targetTr = [matchTr];

	for(let i=0;i<targetTr.length;i++){
		result.push({});
		for(let j=0;j<targetTr[i].children().length;j++){
			let allTds = $(targetTr[i]).children()[j];
			let allTdsVal = $(allTds).text()
			result[i][serial[j]] = allTdsVal;
		}
	}
	return result
}

		
module.exports={
	scrapJHU:scrapFromGithub,
	scrapJHUBefore22:scrapFromGithubBefore22,
	scrapWorldoMeters:scrapFromWorld,
	allData:scrapAllData,
}




// https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/03-21-2020.csv
// https://www.worldometers.info/coronavirus