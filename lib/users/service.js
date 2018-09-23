const dal = require('../data');
const { removePassword } = require('../helpers');

const create = user => {
	return dal.create('users', user.phone, user)
		.then(removePassword);
};

const get = phone => {
	return dal.read('users', phone)
		.then(removePassword);
};

const update = (data) => {
	return dal.update('users', data.phone, data)
		.then(removePassword);
};

const del = phone => {
	return dal.del('users', phone)
		.then(removePassword);
};

module.exports = {
	create, get, update, del
};
