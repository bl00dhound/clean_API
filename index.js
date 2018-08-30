const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const config = require('./config');
const handlers = {};
const httpsOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem')
};

handlers.notFound = (data, cb) => cb(404); 
handlers.root = (data, cb) => cb(200, 'API v1.0');
handlers.hello = (data, cb) => cb(200, { message: 'Hello!!!' });

const router = {
	root: handlers.root,
	hello: handlers.hello,
	notFound: handlers.notFound
}

const server = (req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const pathname = parsedUrl.pathname;
	const trimmedPathname = pathname.replace(/^\/+|\/+$/g, '') || 'root';
	const queryString = parsedUrl.query;
	const method = req.method.toLowerCase();
	const headers = req.headers;

	const decoder = new StringDecoder('utf-8');
	let buffer = '';

	req.on('data', data => {
		buffer += decoder.write(data);
	});
	req.on('end', () => {
		buffer += decoder.end();

		const currentHandler = typeof(router[trimmedPathname]) === 'undefined' ? router.notFound : router[trimmedPathname];
		const data = {
			trimmedPathname,
			queryString,
			method,
			headers,
			payload: buffer			
		};

		currentHandler(data, (statusCode, payload) => {
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

			payload = payload ? JSON.stringify(payload) : '';

			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payload);
			console.log('Returning this response: ', statusCode, payload);
		});

	});
};

const httpServer = http.createServer(server);
const httpsServer = https.createServer(httpsOptions, server);

httpServer.listen(config.httpPort, () => {
	console.log(`HTTP server is started on ${config.httpPort} port.`);
});

httpsServer.listen(config.httpsPort, () => {
	console.log(`HTTPS serser is started on ${config.httpsPort} port.`)
});
