# Assets

Assets are files that get loaded before the game starts, and turned into objects available through the Pearl instance. Assets are loaded based on a _type_ and _location_:

```typescript
import {AssetsList, ImageAsset, AudioAsset} from  'pearl';

const assets = new AssetsList({
  sword: new ImageAsset(require('./sprites/sword.png')),
});
```

You can also add custom assets to load by extending the `Asset` class:

```typescript
import {AssetsList, Asset} from 'pearl';

class LevelAsset extends Asset {
  async load(): Promise<string> {
    const resp = await fetch(this.path);
    const level = await resp.body();
    return level;
  }
}

const assets = new AssetsList({
  level: new LevelAsset(require('./level.tmx)),
});
```

Assets are then attached when creating Pearl:

```typescript
createPearl({
  assets: assets,
  // ....
});
```

Inside Pearl:

```typescript
class Level {
  init() {
    // yes, you have to manually cast it
    const levelData = this.pearl.assets.get(Level2D, 'level');
  }
}
```