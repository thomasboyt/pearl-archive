'use strict';

const gulp = require('gulp');
const typescript = require('gulp-typescript');
const babel = require('gulp-babel');
const merge = require('merge2');
const filter = require('gulp-filter');
const rename = require('gulp-rename');
const del = require('del');
const clone = require('gulp-clone');

const src = './src/**/*.ts';
const spec = './spec/**/*.ts';
const types = './types/**/*.ts';

const tsProject = typescript.createProject('tsconfig.json', {
  typescript: require('typescript'),
});

gulp.task('clean', () => {
  return del(['dist', 'tmp']);
});

function distCopy(input, out) {
  return input
    .pipe(clone())
    // Get only the src/ tree for copying to dist
    .pipe(filter(['src/**/*']))
    .pipe(rename((path) => {
      path.dirname = path.dirname.replace(/^src\/?/, '');
    }))
    .pipe(gulp.dest(`dist/${out}`));
}

gulp.task('build', ['clean'], () => {
  const tsResult = gulp.src([src, spec, types], {base: '.'})
    .pipe(typescript(tsProject));

  // ES2015 output
  const es = tsResult.js;

  // Definitions
  const definitions = tsResult.dts;

  // Babel output
  const cjs = es.pipe(clone()).pipe(babel());

  // The full ES2015 output is compiled to tmp/ava for ava
  const tests = es.pipe(clone()).pipe(gulp.dest('tmp/ava'));

  return merge([
    tests,
    distCopy(es, 'es'),
    distCopy(cjs, 'cjs'),
    distCopy(definitions, 'definitions'),
  ]);
});

gulp.task('default', ['build']);

gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.ts', ['build']);
});