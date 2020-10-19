module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: 'standard',
    rules: {
        'eqeqeq': 1,
        'no-var': 2,
        'indent': ['error', 4]
    },
    globals: {
        App: true,
        Component: true,
        Page: true,
        wx: true,
        getApp: true,
        getCurrentPages: true
    }
}
