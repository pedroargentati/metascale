import type { Config } from '@jest/types';

/**
 * @see https://jestjs.io/docs/configuration
 */

// Sync object
const config: Config.InitialOptions = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	testMatch: ['**/*.test.ts'],
	coverageDirectory: 'coverage',
	collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
	collectCoverage: true /** padrão é coletar cobertura */,
	coveragePathIgnorePatterns: [
		'index.ts',
		'kafka.app.ts',
		'client.ts',
		'kafka-service.ts',
		'fetchDataService.ts',
		'etl-processor.ts ',
		'kafka.config.ts',
		'logger.ts',
		'DynamoDBService.ts',
		'asyncHandler.ts',
		'loggerMiddleware.ts',
		'routes',
		'routes.ts',
		'kafka-controller.ts',
		'etl-processor.ts',
	],
};

export default config;
