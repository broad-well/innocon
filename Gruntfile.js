// Global gruntfile for further automation

module.exports = function(grunt) {

    grunt.initConfig({
        run_grunt: {
            client: {
                src: ['client/Gruntfile.js'],
            },
            server: {
                src: ['server/Gruntfile.js'],
            },
        },
    });
    
    grunt.loadNpmTasks('grunt-run-grunt');
    grunt.registerTask('default', ['run_grunt']);
}