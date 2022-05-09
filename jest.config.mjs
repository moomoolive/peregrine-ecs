/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    preset: 'ts-jest/presets/default-esm',
    globals: {
        "ts-jest": {useESM: true}
    },
    testEnvironment: "jsdom",
    verbose: true,
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    modulePathIgnorePatterns: [
        "<rootDir>/node_modules", 
        "<rootDir>/dist"
    ],
}