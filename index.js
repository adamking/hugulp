#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const program = require('commander')
const gulp = require('gulp')
const log = require('fancy-log')
const colors = require('ansi-colors')

require(path.join(fs.realpathSync(__dirname), 'gulp', 'build'))
require(path.join(fs.realpathSync(__dirname), 'gulp', 'watch'))

function init () {
  log(colors.red(`hugulp v${module.exports.version}`))

  const hugulpRc = path.join(process.cwd(), '.hugulprc')

  if (fs.existsSync(hugulpRc)) {
    log(colors.yellow('.hugulprc already exists (initialization skipped)'))
    return
  }

  const config = {
    version: 2,
    pipeline: ['images', 'styles', 'scripts', 'fingerprint', 'html'],
    path: {
      styles: 'styles',
      images: 'images',
      scripts: 'scripts'
    },
    watch: {
      source: 'assets',
      target: 'static'
    },
    build: {
      source: 'public',
      target: 'public'
    },
    autoprefixer: {
      browsers: ['last 2 versions']
    },
    cleancss: {
      advanced: false
    },
    htmlmin: {
      collapseWhitespace: true
    },
    gifsicle: { interlaced: true },
    jpegtran: { progressive: true },
    optipng: { optimizationLevel: 5 },
    svgo: {
      plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
    }
  }

  fs.writeFileSync(hugulpRc, JSON.stringify(config, null, '  '))

  log(colors.green('hugulp has been initialized (.hugulprc was created with default values)'))
}

function build () {
  log(colors.red(`hugulp v${module.exports.version}`))
  gulp.start('build')
}

function watch () {
  log(colors.red(`hugulp v${module.exports.version}`))

  gulp.start('watch')
}

function version () {
  log(`hugulp v${module.exports.version}`)
}

program
  .command('init')
  .description('create default .hugulprc')
  .action(init)

program
  .command('version')
  .description('display version information')
  .action(version)

program
  .command('build')
  .description('optimize site (for publishing purposes)')
  .action(build)

program
  .command('watch')
  .description('watch for changes to styles and/or javascript')
  .action(watch)

program.parse(process.argv)
