const environment = {
	staging: {
		httpPort: 4000,
		httpsPort: 4001,
		env: 'staging'
	},
	production: {
		httpPort: 5000,
		httpsPort: 5001,
		env: 'production'
	}
};

const secret = 'so so secret';

const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

const env = typeof (environment[currentEnvironment]) === 'object' ? environment[currentEnvironment] : environment.staging;

module.exports = {
	env,
	secret
};
