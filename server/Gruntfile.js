module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        tslint: {
            options: {
                configuration: 'tslint.json'
            },
            files: {
                src: [
                    'src/rest.ts',
                ]
            }
        },
        ts: {
            default: {
                tsconfig: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', ['ts']);

}
