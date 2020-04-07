const fastify = require('../app')
const country = require('../middleware/countryModifier')

// test('should give all valid vlaue', () => {
// 	expect(country('uk')).toBe('UK')
// })

// test('should give all valid vlaue', () => {
// 	expect(country('united kingdom')).toBe('United Kingdom')
// })

// test('should give all valid vlaue', () => {
// 	expect(country('united       kingdom')).toBe('United Kingdom')
// })

// test('should give all valid vlaue', () => {
// 	expect(country('bangladesh')).toBe('Bangladesh')
// })

// test('should give all valid vlaue', () => {
// 	expect(country('United         kingdom')).toBe('United Kingdom')
// })


// for slow loading i have to increase timeout in most cases.

// afterAll(() => {
// 	fastify.close();
// })

// test('should  scrap all data', async () => {
// 	const response = await fastify.inject({
// 		method:'GET',
// 		url:'/alldata',
// 	})
// 	expect(response.statusCode).toBe(200)
// },40000)

// test('should scrap data from source2', async () => {
// 	const response = await fastify.inject({
// 		method:'GET',
// 		url:'/source2/italy',
// 	})
// 	expect(response.statusCode).toBe(200)
// },600000)

// test('should scrap data from source1 before 22 march', async () => {
// 	const response = await fastify.inject({
// 		method:'GET',
// 		url:'/source1/03-21-2020/italy',
// 	})
// 	expect(response.statusCode).toBe(200)
// },30000)

// test('should scrap data from source1 after 22 march', async () => {
// 	const response = await fastify.inject({
// 		method:'GET',
// 		url:'/source1/03-26-2020/italy',
// 	})
// 	expect(response.statusCode).toBe(200)
// },600000)

// test('should load the (/) route', async () => {
// 	const response = await fastify.inject({
// 		method:'GET',
// 		url:'/',
// 	})
// 	expect(response.statusCode).toBe(200)
// })

test('should failed to load data as its not available yet ', async () => {
	const response = await fastify.inject({
		method:'GET',
		url:'/source1/03-25-2020/italy',
	})
	expect(response.statusCode).toBe(400)
},600000)



test('should failed to scrap all data due to network connection', async () => {
	const response = await fastify.inject({
		method:'GET',
		url:'/alldata',
	})
	expect(response.statusCode).toBe(400)
})

test('should failed to scrap data  from source1 due to network connection', async () => {
	const response = await fastify.inject({
		method:'GET',
		url:'/source1/03-21-2020/italy',
	})
	expect(response.statusCode).toBe(400)
})


test('should failed to scrap data from source2 due to network connection', async () => {
	const response = await fastify.inject({
		method:'GET',
		url:'/source2/italy',
	})
	expect(response.statusCode).toBe(400)
})

test('should failed to scrap data because of invalid date', async () => {
	const response = await fastify.inject({
		method:'GET',
		url:'/source1/04-27-2020/italy',
	})
	expect(response.statusCode).toBe(411)
})