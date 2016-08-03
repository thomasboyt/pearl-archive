# Pearl [![Build Status](https://travis-ci.org/thomasboyt/pearl.svg)](https://travis-ci.org/thomasboyt/pearl) [![npm](https://img.shields.io/npm/v/pearl.svg?maxAge=2592000)](https://www.npmjs.com/package/pearl)

Pearl is a small framework for creating video games in the browser. It's written in TypeScript, but can be used in any language that compiles to JavaScript.

Pearl aims to be a a simpler, code-only alternative to full-scale frameworks like [Unity](http://unity3d.com/) or [Superpowers](http://superpowers-html5.com/). Like those frameworks, Pearl uses the [Component](http://gameprogrammingpatterns.com/component.html) pattern to avoid complex object hierarchies and difficult-to-decompose entities. Unlike those frameworks, Pearl is a *code-only framework*, and does not include any editor or special tooling.

**Pearl is in very early alpha stages,** and will probably undergo many significant breaking changes before the first `0.1.0` release. There are many unanswered questions in the current design.

## Docs & Help

* [Getting Started](/docs/getting-started.md)
* [Documentation](/docs)
* [Roadmap](/Roadmap.md)

## Development Overview

Pearl's build pipeline is slightly more complicated than most TypeScript projects because, after TypeScript compilation, it transpiles to ES5 using Babel. This is due to Pearl's usage of several features that TypeScript does not transpile, such as iterators and generators.

Hopefully, Pearl will at some point have a proper build pipeline powered by Gulp or Broccoli that can handle per-file builds and have a nice watcher, but for now, I just wrote up a quick build script and stuck it in `scripts/builder.js`.

### Build

```
npm run build
```

### Test

Tests are run through [ava](https://github.com/avajs/ava). Ava has a built-in Babel compile step (yay!) but does not have built-in TypeScript compilation (boo), so the TypeScript part of `scripts/builder.js` is run first.

```
npm test
```

### View Examples

Examples are built and hosted through Webpack/webpack-dev-server. Run:

```
npm install
npm run run-examples
```

and open `localhost:8080` in your browser.

## Todo

- [ ] Improve coroutine API:
  - https://twitter.com/machty/status/756266064049233920
  - https://twitter.com/drosenwasser/status/756359260380856320
- [ ] Port Coquette tests
- [ ] Write more tests!
- [ ] Autofocus
- [x] Ship babel-compiled version
- [x] Add retina scaling to canvas
- [x] Fix abstract class usage
- [x] New tests!
- [x] Investigate coroutine scheduling (e.g. http://docs.unity3d.com/ScriptReference/MonoBehaviour.StartCoroutine.html?from=Coroutine)