const fastify = require('./fastify/app');

const PORT = process.env.PORT || 5000
async function start(){
	try {

		fastify.listen(5000);
		console.log(`server listen on ${PORT}`)
	}
	catch (e){
		console.log(e)
		process.exit(1);
	}
}

start()