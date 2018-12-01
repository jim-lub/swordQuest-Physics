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

  const entities = new Engine();

  function _update(step) {
    Ctrls.emit();
    if (Events.listen('ctrls_key_a').active) entities.entities[0].move(-1200, 0);
    if (Events.listen('ctrls_key_d').active) entities.entities[0].move(1200, 0);
    if (entities.entities[0].collision.hit('y')){
      if (Events.listen('ctrls_key_space').active) entities.entities[0].jump(0, -15000);
    }

    entities.update(step);
  }

  function _render(dt) {
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, 1280, 640);

    player = entities.entities[0].XY('position');
    player2 = entities.entities[1].XY('position');
    player3 = entities.entities[2].XY('position');


    ctx.fillStyle = "black";
    entities.tiles.forEach(tile => {
      ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
    });

    ctx.fillText(entities.entities[0].velocity.x + ' - ' + entities.entities[0].velocity.y, 50, 50);

    ctx.fillStyle = "grey";
    ctx.fillRect(player.x, player.y, 50, 50);
    ctx.fillRect(player2.x, player2.y, 75, 75);
    ctx.fillRect(player3.x, player3.y, 100, 100);
  }

  function init() {
    entities.newEntity(150, 150, 50, 50, 100);
    entities.newEntity(350, 150, 75, 75, 180);
    entities.newEntity(550, 150, 100, 100, 280);

    entities.newTile(150, 450, 100, 100);
    entities.newTile(250, 550, 100, 100);
    entities.newTile(450, 350, 100, 100);
    entities.newTile(360, 450, 50, 50);
    entities.newTile(550, 550, 100, 100);
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
