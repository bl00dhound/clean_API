const environment = {};

environment.staging = {
	httpPort : 4000,
	httpsPort: 4001,
	env: 'staging'
};

environment.production = {
	httpPort : 5000,
	httpsPort: 5001,
	env: 'production'
};

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

module.exports = typeof(environment[currentEnvironment]) === 'object' ? environment[currentEnvironment] : environment.staging;