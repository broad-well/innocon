module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        sass: {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                    'out/styles/control/bare.css': 'src/styles/control/bare.scss',
                },
            },
        },
        tslint: {
            options: {
                configuration: 'tslint.json',
            },
            files: {
                src: ['src/styles/control/bare.ts', 'src/base.ts'],
            },
        },
        ts: {
            default: {
                tsconfig: true,
            },
        },
        copy: {
            stylehtml: {
                files: [
                    { expand: true, flatten: true, filter: 'isFile', src: ['src/styles/control/bare.html'], dest: 'out/styles/control/' },
                ],
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['tslint', 'ts', 'sass', 'copy']);
};