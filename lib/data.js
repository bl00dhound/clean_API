const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const fsOpen = promisify(fs.open);
const fsClose = promisify(fs.close);
const fsWriteFile = promisify(fs.writeFile);
const fsReadFile = promisify(fs.readFile);
const fsUnlink = promisify(fs.unlink);
const fsReadDir = promisify(fs.readdir);

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

const readAll = dir => fsReadDir(`${DATA_DIR}/${dir}`)
	.then(files => Promise.all(
		files.map(file => read(dir, file.replace(/\.json$/, '')))
	));

const update = (dir, file, data) => fsReadFile(getFilePath(dir, file), 'utf8')
	.then(jsonParse)
	.then(user => Object.assign(user, data))
	.then(mergedUser => fsWriteFile(getFilePath(dir, file), JSON.stringify(mergedUser)))
	.then(() => fsReadFile(getFilePath(dir, file), 'utf8'))
	.then(jsonParse);

const del = (dir, file) => fsReadFile(getFilePath(dir, file), 'utf8')
	.then(jsonParse)
	.then(user => Promise.all([
		Promise.resolve(user),
		fsUnlink(getFilePath(dir, file))
	]))
	.then(([deletedUser]) => deletedUser);

module.exports = {
	create, read, update, del, readAll
};
