module.exports = function (grunt) {

    const lib = 'app/lib';

    grunt.initConfig({
        bower: {
            dev: {
                dest: lib,
                css_dest: lib + '/css',
                options: {
                    stripAffix: true,
                    packageSpecific: {
                        'angular-mocks': {
                            dest: 'test/lib',
                            files: [
                                'angular-mocks.js'
                            ]
                        },
                        bootstrap: {
                            dest: lib + '/fonts',
                            js_dest: lib,
                            files: [
                                'dist/css/bootstrap-theme.css'
                            ]
                        }
                    }
                }
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js'
            },
            dev: {
                configFile: 'test/karma.conf.js',
                singleRun: false,
                autoWatch: true
            }
        },
        'http-server': {
            'dev': {
                root: 'app',

                port: 8081,
                host: "127.0.0.1",

                showDir: false,
                autoIndex: false,
                defaultExt: "html",

                runInBackground: false
            }
        },
        'gh-pages': {
            options: {
                base: 'app',
                message: 'Publish to github pages from grunt'
            },
            'prod': {
                options: {
                    repo: 'git@github.com:Pragmatists/OpenTrappUI.git'
                },
                src: '**/*'
            },
            'dev-mpi': {
                options: {
                    repo: 'git@github.com:mpi/OpenTrappUI.git'
                },
                src: '**/*'
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('default', ['bower', 'karma:unit']);

    grunt.registerTask('server', ["default", 'http-server:dev']);

};
