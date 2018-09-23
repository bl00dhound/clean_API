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

const validateEmail = email => typeof (email) === 'string' && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) ? email.trim() : false;
const validatePhone = phone => typeof (phone) === 'string' && /^\+?\d+(-\d+)*$/.test(phone) ? phone.trim() : false;
const validateString = (str, minLength = 3) => typeof (str) === 'string' && str.trim().length >= minLength ? str.trim() : false;
const validateBoolean = bool => typeof (bool) === 'boolean' && bool;

const createError = errorCode => {
	const error = new Error();
	error.code = errorCode;
	return error;
};

const createRandomString = length => {
	const symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < length; i += 1) {
		result += symbols[Math.floor(Math.random() * symbols.length)];
	}
	return result;
};

module.exports = {
	hashPassword,
	removePassword,
	jsonParse,
	checkMethods,
	validateEmail,
	validatePhone,
	validateString,
	validateBoolean,
	createError,
	createRandomString
};
