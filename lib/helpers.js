const crypto = require('crypto');

const secret = require('../config').secret;

const hashPassword = str => crypto.createHmac('sha256', secret)
	.update(str)
	.digest('hex');

const removePassword = user => {
	const tempUser = user;
	delete tempUser.password;
	return tempUser;
};

const jsonParse = (data) => {
	let parsedData = {};
	try {
		parsedData = JSON.parse(data);
	} catch (err) {
		console.error(err, 'parsed error');
	}
	return parsedData;
};


module.exports = {
	hashPassword,
	removePassword,
	jsonParse
};
