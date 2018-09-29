const dal = require('../data');
const { createError, createRandomString } = require('../helpers');

const create = ({ phone, password }) => {
	return dal.read('users', phone)
		.then(user => {
			if (password !== user.password) throw createError('WRONG_PSWD');
			return {
				id: createRandomString(20),
				phone,
				expires: Date.now() + 1000 * 60 * 60
			};
		})
		.then(token => dal.create('tokens', token.id, token));
};

const read = id => dal.read('tokens', id);

const update = ({ id }) => dal.read('tokens', id)
	.then(token => {
		const data = {
			id,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 30
		};
		if (token.expires < Date.now()) throw createError('TOKEN_EXPIRED');

		return dal.update('tokens', id, data);
	});

const del = id => dal.del('tokens', id);

const validateToken = (id, phone) => dal.read('tokens', id)
	.then(token => {
		if (!token) return false;
		if (token.phone !== phone) return false;
		if (token.expires < Date.now()) return false;
		return true;
	})
	.catch(() => {
		throw createError('TOKEN_NOT_EXIST');
	});

module.exports = {
	create, read, update, del, validateToken
};
