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

  function _update(step) {
    Ctrls.emit();

    const Ph = Entities.Box1;
    let speed = 600;
    if (Events.listen('ctrls_key_d').active) Ph.move(speed, 0);
    if (Events.listen('ctrls_key_a').active) Ph.move(-speed, 0);
    if (Events.listen('ctrls_key_w').active) Ph.move(0, -speed);
    if (Events.listen('ctrls_key_s').active) Ph.move(0, speed);
    if (Events.listen('ctrls_key_space').active) Ph.special();

    Ph.update(step);
    Entities.Box2.update(step);
    Entities.Box3.update(step);
  }

  function _render(dt) {
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, 1280, 640);

    const Ph = Entities.Box1;


    let player = Ph.XY('position');
    let velocity = Ph.XY('velocity');
    let acceleration = Ph.XY('acceleration');

    let box2 = Entities.Box2.XY('position');
    let box3 = Entities.Box3.XY('position');

    ctx.fillStyle = "grey";
    ctx.fillRect(player.x - 22.5, player.y - 22.5, 50, 50);
    ctx.fillRect(box2.x - 22.5, box2.y - 22.5, 60, 60);
    ctx.fillRect(box3.x - 22.5, box3.y - 22.5, 70, 70);

    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, 5, 5);
    ctx.fillText(Ph.position.x, 10, 10);
    ctx.fillText(Ph.position.y, 10, 30);

    ctx.fillStyle = "red";
    ctx.fillRect(player.x + velocity.x, player.y + velocity.y, 5, 5);
    ctx.fillText(Ph.velocity.x, 10, 50);
    ctx.fillText(Ph.velocity.y, 10, 70);
    ctx.fillText(Ph.velocity.mag(), 10, 60);

    ctx.fillStyle = "blue";
    ctx.fillRect(player.x + acceleration.x * 10, player.y + acceleration.y * 10, 5, 5);
    ctx.fillText(Ph.acceleration.x, 10, 90);
    ctx.fillText(Ph.acceleration.y, 10, 110);
  }

  function init() {
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
  Entities: {
    Box1: new Dynamic({x: 150, y: 150, mass: 80}),
    Box2: new Dynamic({x: 350, y: 150, mass: 100}),
    Box3: new Dynamic({x: 550, y: 150, mass: 150})
  }
}));
