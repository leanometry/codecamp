module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  //  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-replace');
  // Default task.
  grunt.registerTask('default', ['jshint','build','karma:unit']);

  //development
  grunt.registerTask('build', ['clean','html2js', 'concat','less:build',
      'copy', 'replace:configDev']);

  //production
  //grunt.registerTask('release', ['clean','html2js','uglify','jshint','karma:unit','concat:index', 'less:min','copy']);
  grunt.registerTask('release', ['clean','html2js',
       'concat',
      //'uglify', 'concat:index',
      'less:min',
      'copy', 'replace:configProd' ]);

  grunt.registerTask('test-watch', ['karma:watch']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',

    pkg: grunt.file.readJSON('package.json'),

    banner: '  <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n  ' ,

    src: {
      configDev: ['configs/*.dev.js'],
      configProd: ['configs/*.prod.js'],
      js: ['src/**/*.js'],
      jsTpl: ['<%= distdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html', 'src/login.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      },
      bootstrapcss: ['src/less/stylesheet.less'], // recess:build doesn't accept ** in its file patterns
      appcss: ['src/css/stylesheet.less'], // recess:build doesn't accept ** in its file patterns
      lessWatch: ['src/less/**/*.less']
    },

    clean: ['<%= distdir %>/*'],

    copy: {
        assets: {
            files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
        }
    },

    karma: {
      unit: { options: karmaConfig('test/config/unit.js') },
      watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
    },

    html2js: {
      app: {
        options: {
          base: 'src/app',
          rename:function(moduleName) {
              return '/' + moduleName;
          }
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= distdir %>/templates/app.js',
        module: 'templates.app'
      },
      common: {
        options: {
          base: 'src/common' ,
          rename:function(moduleName) {
                return '/' + moduleName;
          }
        },
        src: ['<%= src.tpl.common %>'],
        dest: '<%= distdir %>/templates/common.js',
        module: 'templates.common'
      }
    },

    concat:{
       dist:{
            options: {
              banner: "/* <%= banner %> */"
            },
            src:['<%= src.js %>', '<%= src.jsTpl %>'],
            dest:'<%= distdir %>/js/<%= pkg.name %>.js'
       },
       index: {
            src: ['src/index.html'],
            dest: '<%= distdir %>/index.html',
            options: {
              process: true
            }
      },

      angular: {
        src:[
            'vendor/angular/angular.js',
            'vendor/angular-route/angular-route.js',
            'vendor/angular-animate/angular-animate.js',
            'vendor/ngInfiniteScroll/ng-infinite-scroll.js',
            'vendor/angular-xeditable/xeditable.js',
            'vendor/angular-loading-bar/loading-bar.js',
            'vendor/angular-cookies/angular-cookies.js',
            'vendor/angular-sanitize/angular-sanitize.js',
        ],
        dest: '<%= distdir %>/js/angular.js'
      },
      bootstrap: {
        src:['vendor/angular-ui/ui-bootstrap-tpls.js'],
        dest: '<%= distdir %>/js/bootstrap.js'
      },

      jquery: {
        src:['vendor/jquery/*.js'],
        dest: '<%= distdir %>/js/jquery.js'
      }
    },

    uglify: {
      dist:{
        options: {
          banner: "/* <%= banner %> */"
        },
        src:['<%= src.js %>' ,'<%= src.jsTpl %>'],
        dest:'<%= distdir %>/js/<%= pkg.name %>.js'
      },
      angular: {
        src:[
            'vendor/angular/angular.js',
            'vendor/angular-route/angular-route.js',
            'vendor/angular-animate/angular-animate.js',
            'vendor/ngInfiniteScroll/ng-infinite-scroll.js',
            'vendor/angular-xeditable/xeditable.js',
            'vendor/angular-loading-bar/loading-bar.js',

            'vendor/angular-cookies/angular-cookies.js',
            'vendor/angular-sanitize/angular-sanitize.js',
        ],
        dest: '<%= distdir %>/js/angular.js'
      },

      bootstrap: {
        src:['vendor/angular-ui/ui-bootstrap-tpls.js'],
        dest: '<%= distdir %>/js/bootstrap.js'
      },

      jquery: {
        src:['vendor/jquery/*.js'],
        dest: '<%= distdir %>/js/jquery.js'
      }
    },

    replace: {
        configDev: {
            options: {
                patterns: [
                    {
                        json: grunt.file.readJSON('./config/environments/development.json')
                    }
                ]
            },
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['./config/config.js'],
                    dest: '<%= distdir %>/js/'
                }
            ]
        },
        configProd: {
            options: {
                patterns: [
                    {
                        json: grunt.file.readJSON('./config/environments/production.json')
                    }
                ]
            },
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['./config/config.js'],
                    dest: '<%= distdir %>/js/'
                }
            ]
        }
    },
    less: {
      build: {
        files: {
          '<%= distdir %>/css/bootstrap.css': ['<%= src.bootstrapcss %>'] ,
          '<%= distdir %>/css/<%= pkg.name %>.css':  ['<%= src.appcss %>']
        },
        options: {
          compile: true
        }
      },
      min: {
        files: {
          '<%= distdir %>/css/bootstrap.css': ['<%= src.bootstrapcss %>'],
          '<%= distdir %>/css/<%= pkg.name %>.css': ['<%= src.appcss %>']
        },
        options: {
          compress: true
        }
      }
    },

    watch:{
      all: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['default','timestamp']
      },
      build: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['build','timestamp']
      }
    },

    jshint:{
      files:['gruntFile.js', '<%= src.js %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });
};
