const errors = require('../errors');
const {
	hashPassword,
	validateBoolean,
	validateEmail,
	validatePhone,
	validateString
} = require('../helpers');

const validate = (payload) => {
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
		name: validateString(parsedData.name),
		email: validateEmail(parsedData.email),
		phone: validatePhone(parsedData.phone),
		address: validateString(parsedData.address, 8),
		password: validateString(parsedData.password, 8),
		tosAgreement: validateBoolean(parsedData.tosAgreement)
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
	let length = 0;
	const userErrors = [];

	try {
		parsedData = JSON.parse(payload);
	} catch (err) {
		userErrors.push(errors.parseError);
		console.error(err, errors.parseError);
		return { user: {}, userErrors };
	}

	const user = {
		name: validateString(parsedData.name),
		email: validateEmail(parsedData.email),
		phone: parsedData.phone && validatePhone(parsedData.phone),
		address: validateString(parsedData.address, 8),
		password: validateString(parsedData.password, 8)
	};

	if (user.password) {
		user.password = hashPassword(user.password);
	}

	const keys = Object.keys(user);
	const updateUserData = keys.reduce((acc, key) => {
		if (user[key]) {
			length += 1;
			acc[key] = user[key];
		}
		return acc;
	}, {});
	if (!updateUserData.phone) userErrors.push(errors.phone);
	if (updateUserData.phone && length === 1) userErrors.push(errors.noDataForUpdating);

	return { updateUserData, userErrors };
};

module.exports = {
	validate,
	validateUpdate
};
