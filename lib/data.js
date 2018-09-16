const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const fsOpen = promisify(fs.open);
const fsClose = promisify(fs.close);
const fsWriteFile = promisify(fs.writeFile);
const fsReadFile = promisify(fs.readFile);

const { jsonParse } = require('./helpers');
const DATA_DIR = path.join(__dirname, '../.data');
const getFilePath = (dir, file) => `${DATA_DIR}/${dir}/${file}.json`;

const create = (dir, file, data) => fsOpen(getFilePath(dir, file), 'wx')
	.then(fileDescriptor => Promise.all([
		Promise.resolve(fileDescriptor),
		fsWriteFile(fileDescriptor, JSON.stringify(data))
	]))
	.then(([fileDescriptor]) => fsClose(fileDescriptor))
	.then(() => fsReadFile(getFilePath(dir, file), 'utf8'))
	.then(jsonParse);

const read = (dir, file) => fsReadFile(getFilePath(dir, file), 'utf8')
	.then(jsonParse);

const update = (dir, file, data) => fsReadFile(getFilePath(dir, file), 'utf8')
	.then(jsonParse)
	.then(user => Object.assign(user, data))
	.then(mergedUser => fsWriteFile(getFilePath(dir, file), JSON.stringify(mergedUser)))
	.then(() => fsReadFile(getFilePath(dir, file), 'utf8'))
	.then(jsonParse);

const remove = (dir, file) => {

};

module.exports = {
	create, read, update, remove
}