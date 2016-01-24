// Generated on 2015-09-20 using generator-angular 0.12.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  // Search a Grunt plugin from the task name, in the following order:
  // 1. node_modules/grunt-contrib-task-name
  // 2. node_modules/grunt-task-name
  // 3. node_modules/task-name
  require('jit-grunt')(grunt, {
    // Static mappings (because the module has not the required name):
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    protractor: 'grunt-protractor-runner',
    configureProxies: 'grunt-connect-proxy'
  });

  // Loads connect 'middlewares'
  var serveStatic = require('serve-static');
  var proxyRequest = require('grunt-connect-proxy/lib/utils').proxyRequest;

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    appConfig: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      typescript: {
        files: ['<%= appConfig.app %>/scripts/{,*/}*.ts'],
        tasks: ['typescript:base']
      },
      typescriptTest: {
        files: ['test/spec/{,*/}*.ts'],
        tasks: ['typescript:test']
      },
      styles: {
        files: ['<%= appConfig.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'postcss']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= appConfig.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '.tmp/scripts/{,*/}*.js',
          '<%= appConfig.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The integration server
    run: {
      integrationServer: {
        options: {
          wait: false
        },
        cmd: 'go-top'
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      proxies: [{
        context: '/',
        host: 'localhost',
        port: 8080
      }],
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              serveStatic('.tmp'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              connect().use(
                '/app/styles',
                serveStatic('./app/styles')
              ),
              serveStatic(appConfig.app),
              proxyRequest
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              serveStatic('.tmp'),
              serveStatic('test'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              serveStatic(appConfig.app),
              proxyRequest
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= appConfig.dist %>'
        }
      }
    },

    // Make sure there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= appConfig.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: [
          'test/*.js'
        ]
      }
    },

    // Make sure code styles are up to par
    jscs: {
      options: {
        config: '.jscsrc',
        verbose: true
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= appConfig.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        src: ['test/*.js']
      }
    },

    tslint: {
      options: {
        configuration: grunt.file.readJSON('tslint.json')
      },
      all: {
        src: ['<%= appConfig.app %>/scripts/{,*/}*.ts']
      },
      test: {
        src: ['test/spec/{,*/}*.ts', 'test/e2e/{,*/}*.ts']
      },
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= appConfig.dist %>/{,*/}*',
            '!<%= appConfig.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: ['last 1 version']})
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= appConfig.app %>/index.html'],
        ignorePath:  /\.\.\//,
        overrides: {
          'socket.io-client': {
            'main': 'socket.io.js'
          },
          'epoch': {
            'main': [
              'dist/js/epoch.js',
              'dist/css/epoch.css'
            ]
          }
        }
      }
    },
    // Compiles TypeScript to JavaScript
    typescript: {
      base: {
        src: ['<%= appConfig.app %>/scripts/{,*/}*.ts'],
          dest: '.tmp/scripts',
          options: {
          module: 'amd', //or commonjs
            target: 'es5', //or es3
            'base_path': '<%= appConfig.app %>/scripts', //quoting base_path to get around jshint warning.
            sourcemap: true,
            declaration: true
        }
      },
      test: {
        src: ['test/spec/{,*/}*.ts', 'test/e2e/{,*/}*.ts'],
          dest: '.tmp/spec',
          options: {
          module: 'amd', //or commonjs
            target: 'es5', //or es3
            sourcemap: true,
            declaration: true
        }
      }
    },
    tsd: {
      refresh: {
        options: {
          // execute a command
          command: 'reinstall',
          config: 'tsd.json'
        }
      }
    },


    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= appConfig.dist %>/scripts/{,*/}*.js',
          '<%= appConfig.dist %>/styles/{,*/}*.css',
          '<%= appConfig.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= appConfig.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= appConfig.app %>/index.html',
      options: {
        dest: '<%= appConfig.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= appConfig.dist %>/{,*/}*.html'],
      css: ['<%= appConfig.dist %>/styles/{,*/}*.css'],
      js: ['<%= appConfig.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= appConfig.dist %>',
          '<%= appConfig.dist %>/images',
          '<%= appConfig.dist %>/styles'
        ],
        patterns: {
          js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= appConfig.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= appConfig.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= appConfig.dist %>',
          src: ['*.html'],
          dest: '<%= appConfig.dist %>'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'uiApp',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= appConfig.app %>',
        src: 'views/{,*/}*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= appConfig.app %>',
          dest: '<%= appConfig.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= appConfig.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= appConfig.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'typescript:base',
        'copy:styles'
      ],
      test: [
        'typescript',
        'copy:styles'
      ],
      dist: [
        'typescript',
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    protractor: {
      options: {
        configFile: 'test/protractor.conf.js',
        webdriverManagerUpdate: true
      },
      run: {}
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'tsd:refresh',
      'concurrent:server',
      'postcss:server',
      'run:integrationServer',
      'configureProxies:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'tsd:refresh',
    'concurrent:test',
    'postcss',
    'run:integrationServer',
    'configureProxies:server',
    'connect:test',
    'karma:unit',
    'protractor:run',
    'stop:integrationServer'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'tsd:refresh',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'newer:jscs',
    'newer:tslint',
    'test',
    'build'
  ]);
};
