const fastify = require('fastify')();
const {scrapJHU,scrapWorldoMeters,allData,scrapJHUBefore22} = require('./scrap/scrapData');
const dateChecker = require('./middleware/checkDate');
const country = require('./utils/countryModifier');

fastify.register(require('fastify-cors'),{
	origin:true,
})

fastify.get('/', (req,reply) => {
	reply.code(200).send({
		source1:{
			url:`http://emon-covid19.herokuapp.com/source1/mm-dd-2020/[country]`,
			example:`http://emon-covid19.herokuapp.com/source1/03-23-2020/italy`,
			dataSource:`https://github.com/CSSEGISandData/COVID-19`,
			copyright:`All right reserved to https://github.com/CSSEGISandData/COVID-19`,
			opinion:`Data of source1 is less updated than source2. But you can get a specific date's data and specific city/province data from source1 which is very helpfull`,
			whyDateInParam:`As John Hopkin University post data on regular basis, I have to add date in the url params for acurate data and handling errors. `

		},
		source2:{
			url:`http://emon-covid19.herokuapp.com/source2/[country]`,
			example:`http://emon-covid19.herokuapp.com/source2/italy`,
			dataSource:`https://www.worldometers.info/coronavirus/`,
			copyright:`All right reserved to https://www.worldometers.info/coronavirus`,
			opinion:`Data of source2 is more updated than source1. As source2's source update their data more frequently you can get most updated result`
		},
		additionalInfo:{
			message:'If you get empty array then check your country name and do some change. Hope you always get correct data',
			source1NameConflict:'US/United Kingdom/China. These three country code for source1',
			source2NameConflict:'USA/UK/China. These three country code for source2'
		}
	
	})
})

fastify.get('/alldata', async (req,reply) => {
	try {
		const data = await allData('https://www.worldometers.info/coronavirus/');
		if(data.error){
			throw new Error('');
		}
		reply.code(200).send(data);
	} catch (e) {
		reply.code(400).send({error:'Could\'t fetch data. Check your network connection'});
	}
})

fastify.route({
	method:'GET',
	url:'/source1/:date/:country',
	onRequest: dateChecker,
	handler: async (req,reply) => {
		const countryName = country(req.params.country);
		const dateBefore23 = new Date(`2020-${req.dateInfo.month}-${req.dateInfo.date}`);
		let data;
		try {
			if(dateBefore23 <new Date('2020-03-22') ) {
				data = await scrapJHUBefore22(`https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/${req.dateInfo.month}-${req.dateInfo.date}-2020.csv`, countryName)
				return reply.code(200).send(data); 
			}
			data = await scrapJHU(`https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/${req.dateInfo.month}-${req.dateInfo.date}-2020.csv`, countryName)
			reply.code(200).send(data);
		} catch (e){
			const errorMessageIndex = e.message.indexOf(':');
			const errorMessage = e.message.slice(0,errorMessageIndex)
			if(errorMessage==='net') {
				return 	reply.code(400).send({error:'Could\'t fetch data. Check your network connection'});
			}
			reply.code(400).send({message:`Data of this date hasn't available yet.`})
		}

	}
})


fastify.get('/source2/:country', async (req,reply) => {
	const countryName = country(req.params.country);
	try {
		const bdScrap = await scrapWorldoMeters('https://www.worldometers.info/coronavirus/', countryName);
		reply.code(200).send(bdScrap);
	} catch (e) {
		reply.code(400).send({error:'Could\'t fetch data. Check your network connection'});
	}
});

fastify.get('/*' , (req,reply) => {
	reply.redirect('/')
})

module.exports = fastify;