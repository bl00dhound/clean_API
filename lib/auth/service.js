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
		.then(token => {
			console.log(token, '****************** token ********************'); // TODO remove console.log
			return dal.create('tokens', token.id, token)
		});
};

const read = id => {
	return Promise.resolve(id);
};

const update = id => {
	return Promise.resolve(id);
};

const del = id => {
	return Promise.resolve(id);
};

module.exports = {
	create, read, update, del
};