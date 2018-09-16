const { validate, validatePhone } = require('./validate');
const errors = require('../errors');
const service = require('./service');

const get = (data, cb) => {
	const phone = data.queryString.phone;
	if (!validatePhone(phone)) return cb(404, [errors.phone]);

	return service.get(phone)
		.then(user => cb(200, user))
		.catch(err => {
			return cb(404, errors[err.code] ? [errors[err.code]] : [errors.userRead]);
		});
};

const post = (data, cb) => {
	const { payload } = data;
	const { user, userErrors } = validate(payload);

	if (userErrors.length > 0) return cb(404, userErrors);

	return service.create(user)
		.then(createdUser => cb(200, createdUser))
		.catch(err => {
			return cb(404, errors[err.code] ? [errors[err.code]] : [errors.userCreate]);
		});
};

const put = (data, cb) => {
	cb(200, 'put')

};

const del = (data, cb) => {
	cb(200, 'delete')

};

module.exports = {
	get, post, put, del
};