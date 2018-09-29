const { validate, validateUpdate } = require('./validate');
const { validatePhone } = require('../helpers');
const errors = require('../errors');
const service = require('./service');
const tokenService = require('../auth/service');

const get = (data, cb) => {
	const phone = data.queryString.phone;
	const token = data.headers.token;

	if (!validatePhone(phone)) return cb(404, [errors.phone]);

	return tokenService.validateToken(token, phone)
		.then(isValid => {
			if (!isValid) return cb(403, [errors.auth]);
			return service.read(phone);
		})
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
		.then(createdUser => cb(201, createdUser))
		.catch(err => {
			return cb(404, errors[err.code] ? [errors[err.code]] : [errors.userCreate]);
		});
};

const put = (data, cb) => {
	const { payload } = data;
	const { updateUserData, userErrors } = validateUpdate(payload);
	const token = data.headers.token;

	if (userErrors.length > 0) return cb(404, userErrors);

	return tokenService.validateToken(token, updateUserData.phone)
		.then(isValid => {
			if (!isValid) return cb(403, [errors.auth]);
			return service.update(updateUserData);
		})
		.then(updatedUser => cb(200, updatedUser))
		.catch(err => {
			return cb(404, errors[err.code] ? [errors[err.code]] : [errors.userUpdate]);
		});
};

const del = (data, cb) => {
	const phone = data.queryString.phone;
	const token = data.headers.token;

	if (!validatePhone(phone)) return cb(404, [errors.phone]);

	return tokenService.validateToken(token, phone)
		.then(isValid => {
			if (!isValid) return cb(403, [errors.auth]);
			return service.del(phone);
		})
		.then(user => cb(200, user))
		.catch(err => {
			return cb(404, errors[err.code] ? [errors[err.code]] : [errors.userDelete]);
		});
};

module.exports = {
	get, post, put, del
};
