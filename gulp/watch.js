// system
const fs = require('fs')
const path = require('path')

// parameters
const config = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), '.hugulprc'))
)

// common
const gulp = require('gulp')
const sequence = require('run-sequence')
const watch = require('gulp-watch')
const gutil = require('gulp-util')

// styles
const merge = require('merge-stream')
const concat = require('gulp-concat')
const helper = require('./util')

gulp.task('watch', function() {
  const styles = [
    path.join(config.watch.source, config.path.styles, '**', '*.s[a|c]ss'),
    path.join(config.watch.source, config.path.styles, '**', '*.less'),
    path.join(config.watch.source, config.path.styles, '**', '*.css')
  ]

  gutil.log(gutil.colors.green(`watching ${JSON.stringify(styles)}`))

  watch(styles, {}, function handle(param) {
    gutil.log(
      gutil.colors.yellow(
        `styles: ${JSON.stringify(param.history[0])} - ${param.event}`
      )
    )

    gulp.start('styles')
  })

  const scripts = [
    path.join(config.watch.source, config.path.scripts, '**', '*.js')
  ]

  gutil.log(gutil.colors.green(`watching ${JSON.stringify(scripts)}`))

  watch(scripts, {}, function handle(param) {
    gutil.log(
      gutil.colors.yellow(
        `scripts: ${JSON.stringify(param.history[0])} - ${param.event}`
      )
    )

    gulp.start('scripts')
  })
})

gulp.task('styles:cleancss', function() {
  const streams = helper.getStylesStreams()

  return merge(...streams)
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(path.join(config.watch.target, config.path.styles))) // i.e.: static/styles/styles.css
})

// default styles task
gulp.task('styles', function() {
  sequence('styles:cleancss')
})

gulp.task('scripts', function() {
  return gulp
    .src(path.join(config.watch.source, config.path.scripts, '**', '*.js'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(gulp.dest(path.join(config.watch.target, config.path.scripts)))
})
