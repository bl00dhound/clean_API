const errors = require('../errors');
const { hashPassword, validatePhone, validateString } = require('../helpers');

const validateAuth = payload => {
	let parsedData = {};
	const authErrors = [];
	try {
		parsedData = JSON.parse(payload);
	} catch (err) {
		authErrors.push(errors.parseError);
		console.error(err, errors.parseError);
		return { token: {}, authErrors };
	}

};

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

module.exports = {
	validateAuth,
	validateCredentials
};
