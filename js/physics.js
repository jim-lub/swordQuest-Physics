/* jshint esversion: 6 */
class Physics {
  constructor() {
    this.F = {
      epsilon: 0.1,
      gravity: 9.81,
      friction: -0.99,
      drag: -0.8,
      scale: 5
    };
  }

  apply(v) {
    let f = Vector.divide(v, this.mass);
    this.acceleration.add(f);
  }

  _gravity() {
    let f = new Vector(0, this.mass * this.F.gravity);
    this.apply(f);
  }

  _friction() {
    let f = this.velocity.clone();
    f.normalize();
    f.multiply(this.F.friction);
    this.apply(f);
  }

  _drag() {
    let f = this.velocity.clone();
    let speed = this.velocity.mag();
    f.normalize();
    f.multiply(this.F.drag * speed * speed);
    this.apply(f);
  }

  /***********************
  * These functions are for testing purposes only!
  ************************/
  special() { // Will trigger on spacebar press
    this.position.y -= 1;
    let force = new Vector(0, -50);
    this.apply(force);
  }

  edges() {
    if (this.position.x > 1280) this.position.x = 0;
    if (this.position.x < 0) this.position.x = 1280;
    if (this.position.y > 600) this.velocity.y = 0;
    if (this.position.y < 0) this.position.y = 640;
  }
}

class Entity extends Physics {
  constructor() {
    super();
  }

  collision() {

  }
}

/*****************************
*
******************************/
class Static extends Entity {
  constructor(object) {
    super();
  }
}


/*****************************
*
******************************/
class Dynamic extends Entity {
  constructor(object) {
    super();
    this.mass = object.mass;
    this.position = new Vector(object.x, object.y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
  }

  XY(v) {
    return {
      x: this[v].x,
      y: this[v].y
    };
  }

  move(x, y) {
    let force = new Vector(x, y);
    this.apply(force);
  }

  update(dt) {
    this._gravity();
    this._friction();
    this._drag();
    dt = dt * 10;

    if (Math.abs(this.velocity.x * dt) < 0.1) this.velocity.x = 0;

    // this.velocity.add(this.acceleration);
    this.velocity.add(Vector.multiply(this.acceleration, dt));

    this.edges();
    let distance = Vector.multiply(this.velocity, dt);
    this.position.add(Vector.multiply(this.velocity, dt));
    // this.position.add(this.velocity);
    this.acceleration.multiply(0);
  }
}

class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  add(v) {
    if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}
    return this;
  }

  substract(v) {
    if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
    return this;
  }

  multiply(v) {
    if (v instanceof Vector) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}
    return this;
  }

  divide(v) {
    if (v instanceof Vector) {
			if (v.x != 0) this.x /= v.x;
			if (v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}
    return this;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v) {
    return this.x * v.x - this.y * v.y;
  }

  min() {
    return Math.min(this.x, this.y);
  }

  max() {
    return Math.max(this.x, this.y);
  }

  mag() {
    return Math.sqrt(this.dot(this));
  }

  normalize() {
    let m = this.mag();
    if (m > 0) return this.divide(m);
  }

  scale(s) {
    this.normalize();
  }

  limit(limit) {
    this.x = (Math.abs(this.x) > limit) ? ((Math.sign(this.x) > 0) ? limit : -limit) : this.x;
    this.y = (Math.abs(this.y) > limit) ? ((Math.sign(this.y) > 0) ? limit : -limit) : this.y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  /*******************
  * Static Methods
  *******************/
  static add(a, b) {
    if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
    else return new Vector(a.x + b, a.y + b);
  }

  static substract(a, b) {
    if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
    else return new Vector(a.x - b, a.y - b);
  }

  static multiply(a, b) {
    if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
    else return new Vector(a.x * b, a.y * b);
  }

  static divide(a, b) {
    if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
    else return new Vector(a.x / b, a.y / b);
  }

}
