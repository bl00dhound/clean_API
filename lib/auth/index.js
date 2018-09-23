const errors = require('../errors');
const service = require('./service');
const { validateCredentials, validateUpdate } = require('./validate');
const { validateString } = require('../helpers');

const get = (data, cb) => service.read(data.queryString.id)
	.then(token => cb(200, token))
	.catch(err => {
		return cb(404, errors[err.code] ? [errors[err.code]] : [errors.tokenRead]);
	});

const post = (data, cb) => {
	const { payload } = data;
	const { user, userErrors } = validateCredentials(payload);

	if (userErrors.length > 0) return cb(404, userErrors);

	return service.create(user)
		.then(createdToken => cb(201, createdToken))
		.catch(err => {
			return cb(404, errors[err.code] ? [errors[err.code]] : [errors.tokenCreate]);
		});
};

const put = (data, cb) => {
	const { payload } = data;
	const { token, tokenErrors } = validateUpdate(payload);

	if (tokenErrors.length > 0) return cb(404, tokenErrors);

	return service.update(token)
		.then(updatedToken => cb(200, updatedToken))
		.catch(err => {
			return cb(404, errors[err.code] ? [errors[err.code]] : [errors.tokenCreate]);
		});
};

const del = (data, cb) => {
	const id = data.queryString.id;
	if (!validateString(id, 20)) return cb(404, [errors.id]);

	return service.del(id)
		.then(() => cb(200, {}))
		.catch(err => cb(404, errors[err.code] ? [errors[err.code]] : [errors.tokenDelete]));
};

module.exports = {
	get, post, put, del
};
