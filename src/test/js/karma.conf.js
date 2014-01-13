module.exports = function (config) {
    config.set({
        basePath: '../../../',
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
