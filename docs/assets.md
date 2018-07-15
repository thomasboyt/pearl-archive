# Assets

_Assets_ represent files that get loaded before the game starts. These can include audio, images, and custom assets such as level data.

Using Pearl's asset system saves you from writing custom code to load assets, and provides a simple UI for accessing your assets within your game's components.

Pearl's asset system does _not_ handle the problem of bundling assets with your game, but is very easy to use with a bundler like Webpack, as you'll see below.

{% hint style="warn" %}
**TODO**: Explain Webpack `require()` a lil bit
{% endhint %}

## Preloading Assets

Pearl includes a special preloader for loading assets before starting the game.

```typescript
import {createPearl, ImageAsset} from 'pearl';

createPearl({
  assets: {
    swordImage: new ImageAsset(require('../sprites/sword.png')),
  },
  // ....
});
```

Now, within a component, we can access and use `swordImage`. For example, here we create a `Sprite` with it:

```typescript
const swordImage = this.pearl.assets.get(ImageAsset, 'swordImage');

const swordSprite = new Sprite(
  swordImage,
  0,
  0,
  swordImage.width,
  swordImage.height
);
```

## Custom Assets

You can define custom assets to load by extending the `Asset` class. For example, to load level data from an external file as a string, we could define an asset:

```typescript
import {AssetBase} from 'pearl';

class LevelAsset extends AssetBase<string> {
  async load(): Promise<string> {
    const resp = await fetch(this.path);
    const level = await resp.body();
    return level;
  }
}

createPearl({
  assets: {
    levelOne: new LevelAsset(require('../levels/levelOne.txt')),
  }
})

class LevelOne extends Component<null> {
  init() {
    const levelData = this.pearl.assets.get(LevelAsset, 'levelOne');
  }
}
```