/**
 * Entrypoint file to allow both commonjs require and import default / named imports
 * to work with the library.
 */
var client = require('./dist/es/index'); // NOSONAR file not transpiled, using 'var' on purpose

module.exports = client.default;
Object.keys(client).forEach(function(key) {
	module.exports[key] = client[key];
});
