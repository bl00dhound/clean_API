const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const config = require('./config');
const router = require('./lib/routes');
const httpsOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem')
};

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

		const currentHandler = typeof (router[trimmedPathname]) === 'undefined' ? router.notFound : router[trimmedPathname];
		const data = {
			trimmedPathname,
			queryString,
			method,
			headers,
			payload: buffer.replace(/\s/g, '')
		};

		currentHandler(data, (statusCode, payload) => {
			const checkedStatusCode = typeof (statusCode) === 'number' ? statusCode : 200;
			const checkedPayload = payload ? JSON.stringify(payload) : '';

			res.setHeader('Content-Type', 'application/json');
			res.writeHead(checkedStatusCode);
			res.end(checkedPayload);
			console.log('Returning this response: ', checkedStatusCode, checkedPayload);
		});
	});
};

const httpServer = http.createServer(server);
const httpsServer = https.createServer(httpsOptions, server);

httpServer.listen(config.httpPort, () => {
	console.log(`HTTP server is started on ${config.httpPort} port.`);
});

httpsServer.listen(config.httpsPort, () => {
	console.log(`HTTPS serser is started on ${config.httpsPort} port.`);
});
