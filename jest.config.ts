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
		'asyncHandler.ts',
		'loggerMiddleware.ts',
		'interfaces/',
		'config/',
		'utils/constants.ts',
		'errors/',
		'routes/',
		'service/client/',
		'service/kafka/',
		'dynamodb/',
		'consumers/',
	],
};

export default config;
