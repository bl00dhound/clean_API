const root = (data, cb) => cb(200, 'API v1.0');

const notFound = (data, cb) => cb(404);

const users = (data, cb) => {
	return cb(200, { message: 'Hello!!!' });
};

module.exports = {
	root,
	users,
	notFound
};
