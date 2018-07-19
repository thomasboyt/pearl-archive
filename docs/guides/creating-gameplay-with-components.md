# Writing Components

{% hint style="warning" %}
This documentation hasn't been finished yet! Sorry about that.
{% endhint %}

Pearl is a framework built around the [Component pattern](http://gameprogrammingpatterns.com/component.html). Lots of big fancy game frameworks, like Unity and Unreal Engine, use this pattern, so you might find it familiar. If not, don't fret!

If you're familiar with OOP, you might best think of components as _really fancy mixins/traits_. In a component system, you have "entities" \(in our case, actual entities in the game world\), which are objects that only hold a few things:

* Metadata that makes it possible to identify what _kind_ of entity this is. In Pearl, this is a _name_ that gets set on an object, plus optional tags to further identify the entity. For example, if you were building a Pac-Man clone, you might create four ghost objects with their own name \(e.g. `Inky`, `Blinky`, `Pinky`, and `Clyde`\), but all sharing a `ghost` tag.
* A list of components that make up the entity. For a Pac-Man ghost, each ghost might have a `SpriteRenderer` to determine what to render and a `Physical` component determining its place in the game world. Since each ghost has different AI, you would then add different components to each ghost for their AI - e.g. `InkyAI`, `BlinkyAI` - that might all subclass a base `GhostAI` component.

Components can easily reference sibling components on the same component - for example, the `GhostAI` component could look up the `Physical` component to determine where it currently is, and make decisions based on the entity's current location.
