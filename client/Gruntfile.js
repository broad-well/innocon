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
          { expand: true, flatten: true, filter: 'isFile', src: ['src/styles/uikit/index.html'], dest: 'out/styles/uikit/' },
        ],
      },
      zepto: {
        files: [
          { expand: true, flatten: true, filter: 'isFile', src: ['node_modules/zepto/dist/*'], dest: 'out/' },
        ]
      }
    },
    browserify: {
      dist: {
        files: {
          'out/styles/control/module.js': ['tmp/ts/**/*.js'],
        },
        options: {
          transform: [['babelify', { presets: ['es2015'] }]],
        }
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['tslint', 'ts', 'browserify', 'sass', 'copy']);
};