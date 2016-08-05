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

To make this easy to manage, Pearl uses Gulp to build. This has configuration semi-incremental builds - basically, the TypeScript build is incremental, but the Babel build is not. On my somewhat-underpowered Macbook, I get 3-5 second builds, which are Good Enough For Now(tm). In the future, I might look into fully-incremental rebuilds through some Gulp magic.

### Build

To build once:

```
npm run build
```

To watch:

```
npm run watch
```

### Test

Tests are run through [ava](https://github.com/avajs/ava). Ava has a built-in Babel compile step (yay!) but does not have built-in TypeScript compilation (boo), so `gulp build` is run first.

```
npm test
```

Tests currently don't have a watcher. Theoretically, ava has a watch flag that will watch the output from Gulp, but I don't know how reliable it is.

### View Examples

Examples are built and hosted through Webpack/webpack-dev-server. Run:

```
npm install
npm run run-examples
```

and open `localhost:8080` in your browser.

## Todo

- [ ] Fix `"Cannot find module 'sat'"` errors when importing TypeScript definition
- [ ] Add new examples
- [ ] Improve coroutine API:
  - https://twitter.com/machty/status/756266064049233920
  - https://twitter.com/drosenwasser/status/756359260380856320
- [ ] Port some Coquette tests
- [ ] Write more tests!
- [ ] Autofocus
- [x] Ship babel-compiled version
- [x] Add retina scaling to canvas
- [x] Fix abstract class usage
- [x] New tests!
- [x] Investigate coroutine scheduling (e.g. http://docs.unity3d.com/ScriptReference/MonoBehaviour.StartCoroutine.html?from=Coroutine)