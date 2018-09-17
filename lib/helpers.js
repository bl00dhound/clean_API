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

const checkMethods = data => {
	const method = data.method === 'delete' ? 'del' : data.method;
	const acceptableMethods = ['get', 'post', 'put', 'del'];
	return acceptableMethods.includes(method) ? method : false;
};


module.exports = {
	hashPassword,
	removePassword,
	jsonParse,
	checkMethods
};
