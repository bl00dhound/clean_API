const userRoute = require('./users');
const { checkMethods } = require('./helpers');

const root = (data, cb) => cb(200, 'API v1.0');

const notFound = (data, cb) => cb(404);

const users = (data, cb) => {
	const method = checkMethods(data);
	if (!method) return cb(405, { error: 'Not accesable method' });
	return userRoute[method](data, cb);
};

const tokens = (data, cb) => {
	const method = checkMethods(data);
	if (!method) return cb(405, { error: 'Not accesable method' });
	return userRoute[method](data, cb);
};

module.exports = {
	root,
	users,
	tokens,
	notFound
};
