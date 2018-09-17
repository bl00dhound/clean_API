const errors = require('../errors');
const { hashPassword } = require('../helpers');

const validateEmail = email => typeof (email) === 'string' && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) ? email.trim() : false;
const validatePhone = phone => typeof (phone) === 'string' && /^\+?\d+(-\d+)*$/.test(phone) ? phone.trim() : false;
const validateString = (str, minLength = 3) => typeof (str) === 'string' && str.trim().length >= minLength ? str.trim() : false;
const validateBoolean = bool => typeof (bool) === 'boolean' && bool;

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
	validateUpdate,
	validatePhone
};
