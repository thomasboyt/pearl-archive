# Pearl

Pearl is a small framework for creating video games in the browser. It's written in TypeScript, but can be used in any language that compiles to JavaScript.

Pearl aims to be a a simpler, code-only alternative to full-scale frameworks like [Unity](http://unity3d.com/) or [Superpowers](http://superpowers-html5.com/). Like those frameworks, Pearl uses the [Component](http://gameprogrammingpatterns.com/component.html) pattern to avoid complex object hierarchies and difficult-to-decompose entities. Unlike those frameworks, Pearl is a *code-only framework*, and does not include any editor or special tooling.

**Pearl is in very early alpha stages,** and will probably undergo many significant breaking changes before the first `0.1.0` release. There are many unanswered questions in the current design.

## Docs & Help

* [Getting Started](/docs/getting-started.md)
* [Documentation](/docs)
* [Roadmap](/Roadmap.md)

### View Examples

Run:

```
npm install
npm run run-examples
```

and open `localhost:8080` in your browser.

## Todo

- [ ] Ship babel-compiled version
- [ ] Improve coroutine API:
  - https://twitter.com/machty/status/756266064049233920
  - https://twitter.com/drosenwasser/status/756359260380856320
- [ ] Port Coquette tests
- [ ] Write more tests!
- [ ] Autofocus
- [x] Add retina scaling to canvas
- [x] Fix abstract class usage
- [x] New tests!
- [x] Investigate coroutine scheduling (e.g. http://docs.unity3d.com/ScriptReference/MonoBehaviour.StartCoroutine.html?from=Coroutine)