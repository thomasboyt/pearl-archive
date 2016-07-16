# Pearl

Pearl is a small framework for creating video games in the browser. It's written in TypeScript, but can be used in any language that compiles to JavaScript.

Pearl is a rewrite (re: copy-paste, currently) of [Coquette](http://coquette.maryrosecook.com/). Unlike Coquette, Pearl is built with TypeScript and ES6 classes in mind. Currently the API is just about the same outside a couple of changes to make things more TypeScript-friendly, but I reckon it'll end up deviating quite a bit from Coquette's original design as things progress.

## View Examples

Run:

```
npm install
npm build-examples
```

and open `example/simple/index.html` in your browser.

## Usage

### Coroutines

## Design Principles

## API

## Todo

- [ ] Fix Entity/Collidable mismatch (think this will involve making Collidable fields nullable and adding `!` unwraps in a bunch of those functions?)
- [ ] Port Coquette tests
- [ ] Autofocus
- [ ] Figure out how to include Coquette's license in this repo, I guess? Since it is a big ol' copy paste at the moment
- [ ] Figure out how to ship a built JavaScript version alongside the TypeScript source (two different packages? look at @staltz's libraries, e.g. https://github.com/staltz/xstream)
- [x] Fix abstract class usage
- [x] New tests!
- [x] Investigate coroutine scheduling (e.g. http://docs.unity3d.com/ScriptReference/MonoBehaviour.StartCoroutine.html?from=Coroutine)