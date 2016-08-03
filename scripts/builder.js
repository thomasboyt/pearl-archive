#!/usr/bin/env node

'use strict';

const path = require('path');
const childProcess = require('child_process');

const execSync = childProcess.execSync;
const spawn = childProcess.spawn;

const getBinPath = (name) => path.join(__dirname, `../node_modules/.bin/${name}`)

const testBuild = process.env.NODE_ENV === 'test';

function runTypeScript() {
  return new Promise((resolve, reject) => {
    const proc = spawn(getBinPath('tsc'), [], {
      stdio: ['pipe', process.stdout, process.stderr]
    });

    proc.on('exit', (code) => {
      // 2 = "type checking failed, but compile succeeded"
      if (code === 0 || code === 2) {
        resolve();
      } else {
        reject(new Error(`Babel failed with code ${code}`));
      }
    });
  });
}

function runBabel() {
  return new Promise((resolve, reject) => {
    const proc = spawn(getBinPath('babel'), ['./tmp/es', '-d', './tmp/cjs'], {
      stdio: ['pipe', process.stdout, process.stderr]
    });

    proc.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Babel failed with code ${code}`));
      }
    });
  });
}

function copyDist() {
  execSync('mkdir -p dist/es');
  execSync('mkdir -p dist/cjs');
  execSync('cp -r tmp/es/src dist/es');
  execSync('cp -r tmp/cjs/src dist/cjs');
}

function main() {
  execSync('rm -rf tmp/');

  runTypeScript()
    .then(() => {
      if (testBuild) {
        return;

      } else {
        return runBabel()
          .then(() => copyDist());
      }
    })
}

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled rejection: ${err}`);

  if (err && err.stack) {
    console.log(err.stack);
  }

  process.exit(1);
});

main();
