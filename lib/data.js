const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const fsOpen = promisify(fs.open);
const fsClose = promisify(fs.close);
const fsWriteFile = promisify(fs.writeFile);
const fsReadFile = promisify(fs.readFile);

const DATA_DIR = path.join(__dirname, '../.data');
const getFilePath = (dir, file) => `${DATA_DIR}/${dir}/${file}.json`;
const jsonParse = (data) => {
	let parsedData = {};
	try {
		parsedData = JSON.parse(data);
	} catch (err) {
		console.error(err, 'parsed error');
	}
	return parsedData;
};

const removePassword = user => {
	const createdUser = user;
	delete createdUser.password;
	return createdUser;
};

const create = (dir, file, data) => fsOpen(getFilePath(dir, file), 'wx')
	.then(fileDescriptor => Promise.all([
		Promise.resolve(fileDescriptor),
		fsWriteFile(fileDescriptor, JSON.stringify(data))
	]))
	.then(([fileDescriptor]) => fsClose(fileDescriptor))
	.then(() => fsReadFile(getFilePath(dir, file), 'utf8'))
	.then(jsonParse)
	.then(removePassword);

const read = (dir, file) => fsReadFile(getFilePath(dir, file), 'utf8')
	.then(jsonParse)
	.then(removePassword);

const update = (dir, file, data) => {

};

const remove = (dir, file) => {

};

module.exports = {
	create, read, update, remove
}