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
};

export default config;
