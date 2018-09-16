const dal = require('../data');

const create = user => {
	return dal.create('users', user.phone, user);
};

const get = phone => {
	return dal.read('users', phone);
};

const update = (data) => {
	console.log(data, 'update');
	return Promise.resolve(data);
};

const del = (data) => {
	console.log(data, 'delete');
	return Promise.resolve(data);
};

module.exports = {
	create, get, update, del
};
