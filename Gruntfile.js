/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    const lib = 'app/lib';
    grunt.initConfig({
        // Task configuration.
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
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-bower');

    // Default task.
    grunt.registerTask('default', ['bower']);

};
