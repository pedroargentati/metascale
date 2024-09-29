import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
	testEnvironment: 'node',
	transform: {
		'^.+\\.(js|jsx|ts)$': 'babel-jest',
	},
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	moduleNameMapper: {
		'(.+)\\.js': '$1',
	},

	collectCoverage: true /** padrão é coletar cobertura */,
	coverageDirectory: 'coverage',
	collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
	coveragePathIgnorePatterns: [
		'index.ts',
		'client.ts',
		'kafka-service.ts',
		'fetchDataService.ts',
		'kafka.config.ts',
		'logger.ts',
		'DynamoDBService.ts',
		'asyncHandler.ts',
		'loggerMiddleware.ts',
		'routes',
		'routes.ts',
		'kafka-controller.ts',
	],
};

export default config;
