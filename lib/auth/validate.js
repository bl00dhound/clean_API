const errors = require('../errors');
const {
	hashPassword,
	validatePhone,
	validateString,
	validateBoolean
} = require('../helpers');

const validateCredentials = payload => {
	let parsedData = {};
	const userErrors = [];
	try {
		parsedData = JSON.parse(payload);
	} catch (err) {
		userErrors.push(errors.parseError);
		console.error(err, errors.parseError);
		return { user: {}, userErrors };
	}
	const user = {
		phone: validatePhone(parsedData.phone),
		password: validateString(parsedData.password, 8)
	};
	if (user.password) {
		user.password = hashPassword(user.password);
	}

	const keys = Object.keys(user);
	keys.forEach(key => {
		if (!user[key]) userErrors.push(errors[key]);
	});

	return { user, userErrors };
};

const validateUpdate = payload => {
	let parsedData = {};
	const tokenErrors = [];
	try {
		parsedData = JSON.parse(payload);
	} catch (err) {
		tokenErrors.push(errors.parseError);
		console.error(err, errors.parseError);
		return { token: {}, tokenErrors };
	}
	const token = {
		id: validateString(parsedData.id, 20),
		extend: validateBoolean(parsedData.extend)
	};
	const keys = Object.keys(token);
	keys.forEach(key => {
		if (!token[key]) tokenErrors.push(errors[key]);
	});

	return { token, tokenErrors };
};

module.exports = {
	validateCredentials,
	validateUpdate
};
