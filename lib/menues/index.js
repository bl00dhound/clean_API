const errors = require('../errors');
const service = require('./service');
const tokenService = require('../auth/service');
const { validatePhone, createError } = require('../helpers');

const get = (data, cb) => {
	const phone = data.queryString.phone;
	const token = data.headers.token;

	if (!validatePhone(phone)) return cb(404, [errors.phone]);

	return tokenService.validateToken(token, phone)
		.then(isValid => {
			if (!isValid) throw createError('auth');
			return service.list();
		})
		.then(menues => cb(200, menues))
		.catch(err => {
			return cb(404, errors[err.code] ? [errors[err.code]] : [errors.menuesRead])
		});
};

module.exports = {
	get
};
