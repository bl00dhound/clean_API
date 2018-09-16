const crypto = require('crypto');

const secret = require('../config').secret;

const hashPassword = str => crypto.createHmac('sha256', secret)
	.update(str)
	.digest('hex');


module.exports = {
	hashPassword
}
