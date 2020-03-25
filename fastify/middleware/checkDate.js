function dateChecker(req,reply,done){
	const dateParams = req.params.date.split('-');
	const currentDate = new Date().getDate();
	const currentMonth = new Date().getMonth() + 1; 
	const validDate = {
		month: dateParams[0].length === 1 ? '0'+dateParams[0] : dateParams[0],
		date:   dateParams[1].length === 1 ? '0'+dateParams[1]: dateParams[1],
	}
	const fullDate = new Date(`2020-${validDate.month}-${validDate.date}`);
	
	if(fullDate > new Date()) {
		return reply.status(411).send({
			error:`Your date params contain invalid date. Date must me less or equal to ${new Date().toLocaleDateString()}. Follow the example url and date format`,
			dateFormat:'mm-dd-yyyy',
			example:'http://localhost:5000/source1/3-23-2020/italy',
			note:'Date available from 1/22/2020'
		})
	}
	req.dateInfo = validDate;
	done();

}

module.exports = dateChecker;