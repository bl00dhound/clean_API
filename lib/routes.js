const userRoute = require('./users');

const root = (data, cb) => cb(200, 'API v1.0');

const notFound = (data, cb) => cb(404);


const users = (data, cb) => {
	let method = data.method === 'delete' ? 'del' : data.method;
	const acceptableMethods = ['get', 'post', 'put', 'del'];
	if (!acceptableMethods.includes(method)) return cb(405, { error: 'Not accesable method' });

	return userRoute[method](data, cb);
};

module.exports = {
	root,
	users,
	notFound
};
