/* jshint esversion: 6 */
const Game = (function({Ctrls, Entities}) {

  const _loop = {
    now: null,
    dt: 0,
    last: null,
    step: 1/60,
    loop() {
      this.now = _timestamp();
      this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);

      while (this.dt > this.step) {
        this.dt = this.dt - this.step;
        _update(this.step);
      }

      _render(this.dt);

      this.last = this.now;
      window.requestAnimationFrame(this.loop.bind(this));
    }
  };

  const physics = new Physics();

  function _update(step) {
    Ctrls.emit();

    physics.update(step);
  }

  function _render(dt) {
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, 1280, 640);

    player = physics.dynamic[0].XY('position');
    player2 = physics.dynamic[1].XY('position');
    player3 = physics.dynamic[2].XY('position');


    ctx.fillStyle = "black";
    physics.static.forEach(tile => {
      ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
    });

    ctx.fillStyle = "grey";
    ctx.fillRect(player.x, player.y, 50, 50);
    ctx.fillRect(player2.x, player2.y, 75, 75);
    ctx.fillRect(player3.x, player3.y, 100, 100);
  }

  function init() {
    physics.newDynamicEntity(150, 150, 50, 50, 80);
    physics.newDynamicEntity(350, 150, 75, 75, 180);
    physics.newDynamicEntity(550, 150, 100, 100, 280);

    physics.newStaticEntity(150, 450, 100, 100);
    physics.newStaticEntity(250, 550, 100, 100);
    physics.newStaticEntity(450, 350, 100, 100);
    physics.newStaticEntity(350, 450, 100, 100);
    physics.newStaticEntity(550, 550, 100, 100);
    window.requestAnimationFrame(_loop.loop.bind(_loop));
  }

  function _timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }

  return {
    init
  };
}({
  Ctrls: new Controls(),
}));
