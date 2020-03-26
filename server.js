const fastify = require('./fastify/app');

const port = process.env.PORT || 5000
async function start(){
	try {

		fastify.listen(port);
		console.log(`server listen on ${port}`)
	}
	catch (e){
		console.log(e)
		process.exit(1);
	}
}

start()
