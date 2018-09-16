const userRoute = require('./users');

const root = (data, cb) => cb(200, 'API v1.0');

const notFound = (data, cb) => cb(404);


const users = (data, cb) => {
	const acceptableMethods = ['get', 'post', 'put', 'delete'];

	if (!acceptableMethods.includes(data.method)) return cb(404, { error: 'Not accesable method' });

	return userRoute[data.method](data, cb);
};

module.exports = {
	root,
	users,
	notFound
};
