/**
 * =========================================================
 * esg:one Dashboard Application
 * =========================================================
 * @license Copyright 2021 Beathamm Ltd (https://esg-one.co)
 * @author  22 Digital Ltd (https://22digital.ltd)
 * @author  Justin Hartman <code@22digital.ltd>
 */
/**
 * Gulp file to automate the various tasks
 */
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cleanCss = require('gulp-clean-css');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const cssbeautify = require('gulp-cssbeautify');
const npmDist = require('gulp-npm-dist');
const gulp = require('gulp');
const sass = require('gulp-sass');
const wait = require('gulp-wait');
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');
const javascriptObfuscator = require('gulp-javascript-obfuscator');
const connect = require('gulp-connect-php');

// Define paths
const paths = {
  dist: {
    base: './dist/',
    front: {
      base: './dist/',
      css: './dist/css',
      html: './dist',
      assets: './dist/assets',
      partials: './dist/partials/',
      scss: './dist/scss',
    },
    dashboard: {
      base: './dist/dashboard/',
      css: './dist/dashboard/css',
      html: './dist/dashboard',
      assets: './dist/dashboard/assets',
      partials: './dist/dashboard/partials/',
      scss: './dist/dashboard/scss',
    },
    vendor: './dist/vendor',
  },
  dev: {
    base: './html&css/',
    front: {
      base: './html&css/',
      css: './html&css/css',
      html: './html&css',
      assets: './html&css/assets',
      partials: './html&css/partials/',
      scss: './html&css/scss',
    },
    dashboard: {
      base: './html&css/dashboard/',
      css: './html&css/dashboard/css',
      html: './html&css/dashboard',
      assets: './html&css/dashboard/assets',
      partials: './html&css/dashboard/partials/',
      scss: './html&css/dashboard/scss',
    },
    vendor: './html&css/vendor',
  },
  base: {
    base: './',
    node: './node_modules',
  },
  src: {
    html: './src/*.*',
    front: {
      base: './src/front/',
      css: './src/front/css',
      html: './src/front/pages/**/*.html',
      assets: './src/front/assets/**/*',
      partials: './src/front/partials',
      scss: './src/front/scss',
    },
    dashboard: {
      base: './src/dashboard/',
      css: './src/dashboard/css',
      pages: './src/dashboard/pages/**/*',
      assets: './src/dashboard/assets/**/*',
      partials: './src/dashboard/partials',
      scss: './src/dashboard/scss',
    },
    node_modules: './node_modules/',
    vendor: './vendor',
  },
  temp: {
    base: './.temp/',
    front: {
      base: './.temp',
      css: './.temp/css',
      html: './.temp',
      assets: './.temp/assets',
    },
    dashboard: {
      base: './.temp/dashboard',
      css: './.temp/dashboard/css',
      assets: './.temp/dashboard/assets',
    },
    vendor: './.temp/vendor',
  },
};


// Compile Dashboard HTML
gulp.task('html-dashboard', function () {
  return gulp
    .src([paths.src.dashboard.pages])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.src.dashboard.partials,
      })
    )
    .pipe(gulp.dest(paths.temp.dashboard.base))
    .pipe(browserSync.stream());
});

// Compile Base HTML
gulp.task('html-base', function () {
  return gulp
    .src([paths.src.html])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.src.front.partials,
      })
    )
    .pipe(gulp.dest(paths.temp.base))
    .pipe(browserSync.stream());
});

gulp.task('html-add', function () {
  return gulp
    .src([paths.src.html])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.src.front + '/home/*',
      })
    )
    .pipe(gulp.dest(paths.temp.base))
    .pipe(browserSync.stream());
});
// Compile Frontend SCSS
gulp.task('scss-front', function () {
  return gulp
    .src([
      paths.src.front.scss + '/front/**/*.scss',
      paths.src.front.scss + '/front.scss',
    ])
    .pipe(wait(500))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['> 1%'],
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.temp.front.css))
    .pipe(browserSync.stream());
});

// Compile Dashboard SCSS
gulp.task('scss-dashboard', function () {
  return gulp
    .src([
      paths.src.dashboard.scss + '/**/*.scss',
      paths.src.dashboard.scss + '/dashboard.scss',
    ])
    .pipe(wait(500))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['> 1%'],
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.temp.dashboard.css))
    .pipe(browserSync.stream());
});

gulp.task('scss', gulp.series('scss-front', 'scss-dashboard'));

// Compile Frontend HTML
gulp.task('html-front', function () {
  return gulp
    .src([paths.src.front.html])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.src.front.partials,
      })
    )
    .pipe(gulp.dest(paths.temp.front.html))
    .pipe(browserSync.stream());
});

gulp.task('html', gulp.series('html-front', 'html-dashboard', 'html-base'));

// Compile Dashboard Assets
gulp.task('assets-front', function () {
  return gulp
    .src([paths.src.front.assets])
    .pipe(gulp.dest(paths.temp.front.assets))
    .pipe(browserSync.stream());
});

// Compile Dashboard Assets
gulp.task('assets-dashboard', function () {
  return gulp
    .src([paths.src.dashboard.assets])
    .pipe(gulp.dest(paths.temp.dashboard.assets))
    .pipe(browserSync.stream());
});

// Obfuscate Login JS file.
gulp.task('assets-login-obfuscator', function () {
  return gulp
    .src('src/dashboard/assets/js/login.js')
    .pipe(
      javascriptObfuscator({
        seed: 'UnHy|O=V>&wXE6WGw+MU8=-+Wg0vI-)]eNwKa;(x%ZX7u:^Ej_TU_9OtJTOY*p8',
        debugProtection: true,
        selfDefending: true,
        stringArrayEncoding: ['base64'],
      })
    )
    .pipe(gulp.dest(paths.temp.dashboard.assets + '/js/'))
    .pipe(browserSync.stream());
});

// Assets
gulp.task(
  'assets',
  gulp.series('assets-front', 'assets-dashboard', 'assets-login-obfuscator')
);

// Vendor
gulp.task('vendor', function () {
  return gulp
    .src(npmDist(), {
      base: paths.src.node_modules,
    })
    .pipe(gulp.dest(paths.temp.vendor));
});

// Serve
gulp.task(
  'serve',
  gulp.series('scss', 'html', 'assets', 'vendor', function () {
    browserSync.init({
      server: paths.temp.base,
    });
    // SCSS Front
    gulp.watch(
      [
        paths.src.front.scss + '/front/**/*.scss',
        paths.src.front.scss + '/front.scss',
      ],
      gulp.series('scss-front')
    );
    // SCSS Dashboard
    gulp.watch(
      [
        paths.src.dashboard.scss + '/**/*.scss',
        paths.src.dashboard.scss + '/dashboard.scss',
      ],
      gulp.series('scss-dashboard')
    );
    // HTML Base
    gulp.watch([paths.src.html], gulp.series('html-base'));
    // HTML Front
    gulp.watch(
      [
        paths.src.front.html,
        paths.src.front.base + '*.html',
        paths.src.front.partials + '/**/*.html',
      ],
      gulp.series('html-front', 'html')
    );
    // HTML Dashboard
    gulp.watch(
      [
        paths.src.dashboard.pages,
        paths.src.dashboard.base + '*.html',
        paths.src.dashboard.partials + '/**/*.html',
      ],
      gulp.series('html-dashboard', 'html')
    );
    // Assets Front
    gulp.watch([paths.src.front.assets], gulp.series('assets-front'));
    // Assets Dashboard
    gulp.watch([paths.src.dashboard.assets], gulp.series('assets-dashboard'));
    // Vendor
    gulp.watch([paths.src.vendor], gulp.series('vendor'));
  })
);

// Beautify CSS Frontend
gulp.task('beautify-front:css', function () {
  return gulp
    .src([paths.dev.front.css + '/front.css'])
    .pipe(cssbeautify())
    .pipe(gulp.dest(paths.dev.front.css));
});

// Beautify CSS Dashboard
gulp.task('beautify-dashboard:css', function () {
  return gulp
    .src([paths.dev.dashboard.css + '/dashboard.css'])
    .pipe(cssbeautify())
    .pipe(gulp.dest(paths.dev.dashboard.css));
});

gulp.task(
  'beautify:css',
  gulp.series('beautify-front:css', 'beautify-dashboard:css')
);

// Minify CSS Frontend
gulp.task('minify-front:css', function () {
  return gulp
    .src([paths.dist.front.css + '/front.css'])
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.dist.front.css));
});

// Minify CSS Dashboard
gulp.task('minify-dashboard:css', function () {
  return gulp
    .src([paths.dist.dashboard.css + '/dashboard.css'])
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.dist.dashboard.css));
});

gulp.task(
  'minify:css',
  gulp.series('minify-front:css', 'minify-dashboard:css')
);

// Minify Html Frontend
gulp.task('minify-front:html', function () {
  return gulp
    .src([paths.dist.front.html + '/*.html'])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest(paths.dist.front.html));
});

// Minify Html Dashboard
gulp.task('minify-dashboard:html', function () {
  return gulp
    .src([
      paths.dist.dashboard.html + '/*.html',
      paths.dist.dashboard.html + '/**/*.html',
    ])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest(paths.dist.dashboard.html));
});

gulp.task(
  'minify:html',
  gulp.series('minify-front:html', 'minify-dashboard:html')
);

// Clean
gulp.task('clean:dist', function () {
  return del([paths.dist.base]);
});

gulp.task('clean:dev', function () {
  return del([paths.dev.base]);
});

// Compile and copy scss/css Frontend
gulp.task('copy-front:dist:css', function () {
  return gulp
    .src([
      paths.src.front.scss + '/front/**/*.scss',
      paths.src.front.scss + '/front.scss',
    ])
    .pipe(wait(500))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['> 1%'],
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.front.css));
});

// Compile and copy scss/css Dashboard
gulp.task('copy-dashboard:dist:css', function () {
  return gulp
    .src([
      paths.src.dashboard.scss + '/**/*.scss',
      paths.src.dashboard.scss + '/dashboard.scss',
    ])
    .pipe(wait(500))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['> 1%'],
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.dashboard.css));
});

gulp.task(
  'copy:dist:css',
  gulp.series('copy-front:dist:css', 'copy-dashboard:dist:css')
);

// Copy dev css Frontend
gulp.task('copy-front:dev:css', function () {
  return gulp
    .src([
      paths.src.front.scss + '/front/**/*.scss',
      paths.src.front.scss + '/front.scss',
    ])
    .pipe(wait(500))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['> 1%'],
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dev.front.css));
});

// Copy dev css Dashboard
gulp.task('copy-dashboard:dev:css', function () {
  return gulp
    .src([
      paths.src.dashboard.scss + '/**/*.scss',
      paths.src.dashboard.scss + '/dashboard.scss',
    ])
    .pipe(wait(500))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['> 1%'],
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dev.dashboard.css));
});

gulp.task(
  'copy:dev:css',
  gulp.series('copy-front:dev:css', 'copy-dashboard:dev:css')
);

// Copy HTML Frontend
gulp.task('copy-front:dist:html', function () {
  return gulp
    .src([paths.src.front.html])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.src.front.partials,
      })
    )
    .pipe(gulp.dest(paths.dist.front.html))
    .pipe(browserSync.stream());
});

// Copy HTML Dashboard
gulp.task('copy-dashboard:dist:html', function () {
  return gulp
    .src([paths.src.dashboard.pages, '!src/dashboard/pages/examples/**/*'])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.src.dashboard.partials,
      })
    )
    .pipe(gulp.dest(paths.dist.dashboard.html));
});

// Copy HTML Base
gulp.task('copy-base:dist:html', function () {
  return gulp
    .src([paths.src.html])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.src.front.partials,
      })
    )
    .pipe(gulp.dest(paths.dist.base))
    .pipe(browserSync.stream());
});

gulp.task(
  'copy:dist:html',
  gulp.series(
    'copy-front:dist:html',
    'copy-dashboard:dist:html',
    'copy-base:dist:html'
  )
);

// Copy Dev Html Frontend
gulp.task('copy-front:dev:html', function () {
  return gulp
    .src([paths.src.front.html])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.src.front.partials,
      })
    )
    .pipe(gulp.dest(paths.dev.front.html))
    .pipe(browserSync.stream());
});

// Copy Dev Html Dashboard
gulp.task('copy-dashboard:dev:html', function () {
  return gulp
    .src([paths.src.dashboard.pages])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.src.dashboard.partials,
      })
    )
    .pipe(gulp.dest(paths.dev.dashboard.html));
});

// Copy Dev Html Base
gulp.task('copy-base:dev:html', function () {
  return gulp
    .src([paths.src.html])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.src.front.partials,
      })
    )
    .pipe(gulp.dest(paths.dev.base))
    .pipe(browserSync.stream());
});

gulp.task(
  'copy:dev:html',
  gulp.series(
    'copy-front:dev:html',
    'copy-dashboard:dev:html',
    'copy-base:dev:html'
  )
);

// Copy assets Dist Frontend
gulp.task('copy-front:dist:assets', function () {
  return gulp
    .src([
      paths.src.front.assets,
      '!src/front/assets/js/*.js',
      paths.src.front.assets + '.min.js',
    ])
    .pipe(gulp.dest(paths.dist.front.assets));
});

gulp.task('bundle', function () {
  return gulp
    .src([
      paths.src.front.assets,
      '!src/front/assets/js/automated/*.js',
      paths.src.front.assets + '.min.js',
    ])
    .pipe(gulp.dest(paths.dist.front.assets));
});

// Copy assets Dist Dashboard
gulp.task('copy-dashboard:dist:assets', function () {
  return gulp
    .src([
      paths.src.dashboard.assets,
      '!src/dashboard/assets/js/*.js',
      //Change back if necessary
      paths.src.dashboard.assets + '.min.js',
    ])
    .pipe(gulp.dest(paths.dist.dashboard.assets));
});

// Obfuscate Dist Login JS file.
gulp.task('copy-dashboard:dist:assets-login', function () {
  return gulp
    .src('src/dashboard/assets/js/login.js')
    .pipe(
      javascriptObfuscator({
        seed: 'UnHy|O=V>&wXE6WGw+MU8=-+Wg0vI-)]eNwKa;(x%ZX7u:^Ej_TU_9OtJTOY*p8',
        debugProtection: true,
        selfDefending: true,
        stringArrayEncoding: ['base64'],
      })
    )
    .pipe(gulp.dest(paths.dist.dashboard.assets + '/js/'));
});

gulp.task(
  'copy:dist:assets',
  gulp.series(
    'copy-front:dist:assets',
    'copy-dashboard:dist:assets',
    'copy-dashboard:dist:assets-login'
  )
);

// Copy assets Dev Frontend
gulp.task('copy-front:dev:assets', function () {
  return gulp
    .src([paths.src.front.assets])
    .pipe(gulp.dest(paths.dev.front.assets));
});

// Copy assets Dev Dashboard
gulp.task('copy-dashboard:dev:assets', function () {
  return gulp
    .src([paths.src.dashboard.assets])
    .pipe(gulp.dest(paths.dev.dashboard.assets));
});

// Obfuscate Dist Login JS file.
gulp.task('copy-dashboard:dev:assets-login', function () {
  return gulp
    .src('src/dashboard/assets/js/login.js')
    .pipe(
      javascriptObfuscator({
        seed: 'UnHy|O=V>&wXE6WGw+MU8=-+Wg0vI-)]eNwKa;(x%ZX7u:^Ej_TU_9OtJTOY*p8',
        debugProtection: true,
        selfDefending: true,
        stringArrayEncoding: ['base64'],
      })
    )
    .pipe(gulp.dest(paths.dev.dashboard.assets + '/js/'));
});

gulp.task(
  'copy:dev:assets',
  gulp.series(
    'copy-front:dev:assets',
    'copy-dashboard:dev:assets',
    'copy-dashboard:dev:assets-login'
  )
);

// Copy node_modules dist
gulp.task('copy:dist:vendor', function () {
  return gulp
    .src(npmDist(), { base: paths.src.node_modules })
    .pipe(gulp.dest(paths.dist.vendor));
});

// Copy node_modules dev
gulp.task('copy:dev:vendor', function () {
  return gulp
    .src(npmDist(), { base: paths.src.node_modules })
    .pipe(gulp.dest(paths.dev.vendor));
});

gulp.task(
  'build:dev',
  gulp.series(
    'clean:dev',
    'copy:dev:css',
    'copy:dev:html',
    'copy:dev:assets',
    'beautify:css',
    'copy:dev:vendor'
  )
);
gulp.task(
  'build:dist',
  gulp.series(
    'clean:dist',
    'copy:dist:css',
    'copy:dist:html',
    'copy:dist:assets',
    'minify:css',
    'minify:html',
    'copy:dist:vendor'
  )
);

// Default
gulp.task('default', gulp.series('serve'));
