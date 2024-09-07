/**
 * @see https://jestjs.io/docs/configuration
 */
// Sync object
const config = {
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
