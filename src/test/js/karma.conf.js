module.exports = function (config) {
    config.set({
        basePath: '../../../',
        exclude: ['**/bootstrap.js', '**/bootstrap.min.js'],
        frameworks: ['jasmine'],
        files: [
            '**/lib/*.js',
            '**/*.js'
        ],

        browsers: [
            'Chrome',
            'PhantomJS'
        ],
        autoWatch: true
    });
};
