const errors = require('../errors');
const service = require('./service');
const { validateCredentials } = require('./validate');

const get = (data, cb) => {

};

const post = (data, cb) => {
	const { payload } = data;
	const { user, userErrors } = validateCredentials(payload);

	if (userErrors.length > 0) return cb(404, userErrors);

	return service.create(user)
		.then(createdToken => cb(200, createdToken))
		.catch(err => {
			return cb(404, errors[err.code] ? [errors[err.code]] : [errors.tokenCreate]);
		});
};

const put = (data, cb) => {

};

const del = (data, cb) => {

};

module.exports = {
	get, post, put, del
};
