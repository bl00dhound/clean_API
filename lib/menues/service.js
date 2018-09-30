const dal = require('../data');

const list = () => dal.readAll('menues');

module.exports = {
	list
};
