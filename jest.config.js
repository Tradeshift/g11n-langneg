/*
 * Changing the config here also applies to the npm script checks.
 * Docs: https://jestjs.io/docs/en/configuration#options
 **/
module.exports = {
	...require('tradeshift-scripts/config').jest,
	// override coverage limits:
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 70,
			lines: 70,
			statements: 70
		}
	},
	modulePaths: ['src'],
	setupFiles: ['./src/setupTests.ts'],
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)']
};
