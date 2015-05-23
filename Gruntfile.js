module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['dist']);

  grunt.registerTask('dist', [
    'browserify:dist',
    'copy:dist'
  ]);

  grunt.initConfig({

    browserify: {
      dist: {
        files: {
          'public/browser.built.js': ['src/js/browser.js']
        }
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/public',
            src: ['**/*'],
            dest: 'public'
          }
        ]
      }
    },

    watch: {
      dist: {
        options: {
          atBegin: true
        },
        tasks: ['dist'],
        files: [
          'src/**/*'
        ]
      }
    }

  });
};
