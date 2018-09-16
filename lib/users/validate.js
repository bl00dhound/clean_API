const errors = require('../errors');
const { hashPassword } = require('../helpers');

const validateEmail = email => typeof (email) === 'string' && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) ? email.trim() : false;
const validatePhone = phone => typeof (phone) === 'string' && /^\+?\d+(-\d+)*$/.test(phone) ? phone.trim() : false;
const validateString = (str, minLength = 3) => typeof (str) === 'string' && str.trim().length >= minLength ? str.trim() : false;
const validateBoolean = bool => typeof (bool) === 'boolean' && bool;

const validate = (payload) => {
	let user = {};
	const userErrors = [];
	try {
		user = JSON.parse(payload);
		user.name = validateString(user.name);
		user.email = validateEmail(user.email);
		user.phone = validatePhone(user.phone);
		user.address = validateString(user.address, 8);
		user.password = validateString(user.password, 8);
		user.tosAgreement = validateBoolean(user.tosAgreement);
	} catch (err) {
		userErrors.push(errors.parseError);
		console.error(err, 'validation error');
	}
	if (user.password) {
		user.password = hashPassword(user.password);
	}

	const keys = Object.keys(user);
	keys.forEach(key => {
		if (!user[key]) {
			userErrors.push(errors[key]);
		}
	});

	return { user, userErrors };
};

module.exports = {
	validate,
	validatePhone
};
