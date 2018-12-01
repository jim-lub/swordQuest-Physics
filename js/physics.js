/* jshint esversion: 6 */
class Physics {
  constructor() {
    this.static = [];
    this.dynamic = [];
  }

  newStaticEntity(x,  y, width, height) {
    this.static.push(new Static({x, y, width, height}));
  }

  newDynamicEntity(x, y, width, height, mass) {
    this.dynamic.push(new Dynamic({x, y, width, height, mass}));
  }

  update(dt) {
    this.dynamic.forEach(cur => {
      cur.update(dt);
      cur.collision.statics = this.static;
    });
  }

}

class CollisionDetection {
  constructor() {
    this.statics = [];
    this.collisionPoints = [];
    this.x = false;
    this.y = false;
  }

  update(pos, vel, width, height) {
    this.x = false;
    this.y = false;

    this.statics.forEach(tile => {
      if (this.boxCollision(this.hitbox(pos, vel, width, height), tile)) {
        this.x = true;
        this.y = true;
      }
    });

    this.statics = [];
  }

  hit(axis) {
    return this[axis];
  }

  boxCollision(points, tile) {
    let isColliding = false;

    for (let i = 0; i < points.length; i++) {
      if (this.pointCollision(points[i], tile)) {
        isColliding = true;
        break;
      }
    }

    return isColliding;
  }

  pointCollision(point, tile) {
    let collisionX = point.x >= tile.x && point.x <= tile.x + tile.width;
    let collisionY = point.y >= tile.y && point.y <=tile.y + tile.height;

    return (collisionX && collisionY);
  }

  hitbox(pos, vel, width, height) {
    return [
      {
        x: pos.x,
        y: pos.y
      },
      {
        x: pos.x,
        y: pos.y + height
      },
      {
        x: pos.x + width,
        y: pos.y
      },
      {
        x: pos.x + width,
        y: pos.y + height
      }
    ];
  }
}

class Entity {
  constructor() {}

}

/*****************************
*
******************************/
class Static extends Entity {
  constructor(object) {
    super();
    this.x = object.x;
    this.y = object.y;
    this.width = object.width;
    this.height = object.height;
  }
}


/*****************************
*
******************************/
class Dynamic extends Entity {
  constructor(object) {
    super();
    this.mass = object.mass;
    this.width = object.width;
    this.height = object.height;
    this.position = new Vector(object.x, object.y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.collision = new CollisionDetection();

    this.F = {
      epsilon: 0.1,
      gravity: 9.81,
      friction: -0.98,
      drag: -0.2
    };
  }

  apply(v) {
    let f = Vector.divide(v, this.mass);
    this.acceleration.add(f);
  }

  _gravity() {
    let f = new Vector(0, (this.F.gravity * this.mass) * 10);
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

  move(x, y) {
    let force = new Vector(x, y);
    this.apply(force);
  }

  XY(v) {
    return {
      x: this[v].x,
      y: this[v].y
    };
  }

  update(dt) {
    this._gravity(dt);
    this._friction(dt);
    this._drag(dt);

    if (Math.abs(this.velocity.x * dt) < 0.1) this.velocity.x = 0;

    this.velocity.add(this.acceleration);

    this.collision.update(Vector.add(this.position, Vector.multiply(this.velocity, dt)), Vector.multiply(this.velocity, dt), this.width, this.height);

    if (!this.collision.hit('y')) this.position.add(Vector.multiply(this.velocity, dt));

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
