/* jshint esversion: 6 */
const Game = (function() {
  const self = {
    now: null,
    dt: 0,
    last: null,
    step: 1/60
  };

  function _timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }

  function _loop() {
    self.now = _timestamp();
    self.dt = self.dt + Math.min(1, (self.now - self.last) / 1000);

    while (self.dt > self.step) {
      self.dt = self.dt - self.step;
      _update(self.step);
    }

    _render();

    self.last = self.now;
    window.requestAnimationFrame(_loop);
  }

  function _update(dt) {
    Ctrls.listen();
    World.update({
      player: Player.getCurrentPosition()
    });
    Player.update({
      dt,
      tiles: World.getTilesInProximityOfPlayer()
    });
    Enemies.update();
  }

  function _render() {
    World.render();
    Player.render();
    Entities.render();
  }

  function init() {
    Player.init();
  }

  return {
    init
  };
}());

/********************************************************/
class Load {
  constructor() {}
}

class UI {
  constructor() {}
}

class Events {
  constructor() {}

  emit() {}
  listen() {}
}

class Ctrls {
  constructor() {}
}

class World {
  constructor() {
    this.level = new Level();
  }

  getTilesInProximityOfPlayer() {
    this.level.get().forEach(cur => {
      // if within range keep in array
    });
  }
}
// -->
    class Level {
      constructor() {
        this.tiles = [];
      }

      get() {return this.tiles;}

      build() {
        // get config
        let tile = new Tile();
        this.tiles.push(tile);
      }
    }
// 1 // --->
          class Tile {
            constructor() {}
          }

          class Scroller {
            constructor() {}
          }


class Player {
  constructor() {
    this.self = new Entity();
    this.animations = new PlayerAnimations();
  }

  getCurrentPosition() {return this.self.pos;}

  fsm() {

  }

  update({dt, tiles}) {
    this.self.update({dt, tiles});
    this.animations.play('idle');
  }

  render() {
    this.animations.getCurrentFrame();
  }
}
// -->
    class PlayerAnimations {
      constructor() {}
      play() {}
      getCurrentFrame() {}
    }
// -->
    class Entity {
      constructor() {
        this.pos = new Vector();
        this.vel = new Vector();
        this.acc = new Vector();
        this.collision = new CollisionDetection();
      }

      update({dt, tiles}) {
        this.collision.update({
          pos: this.pos,
          vel: this.vel,
          width: this.width,
          height: this.height,
          tiles
        });
      }
    }
// 1 // --->
          class Vector {
            constructor() {}
          }

          class CollisionDetection {
            constructor() {}
          }
