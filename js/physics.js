/* jshint esversion: 6 */
class Engine {
  constructor() {
    this.tiles = [];
    this.entities = [];
  }

  newTile(x,  y, width, height) {
    this.tiles.push(new Tile({x, y, width, height}));
  }

  newEntity(x, y, width, height, mass) {
    this.entities.push(new Dynamic({x, y, width, height, mass}));
  }

  update(dt) {
    this.entities.forEach(cur => {
      cur.update(dt);
      cur.collision.tiles = this.tiles;
    });
  }
}

class CollisionDetection {
  constructor() {
    this.tiles = [];
    this.collisionPoints = [];
    this.x = false;
    this.y = false;
  }

  update(pos, vel, width, height) {
    this.x = false;
    this.y = false;

    let hitboxX = this.hitbox(pos, {x: vel.x, y: 0}, width, height);
    let hitboxY = this.hitbox(pos, {x: 0, y: vel.y}, width, height);

    this.tiles.forEach(tile => {
      if (this.boxCollision(hitboxX, tile)) this.x = true;
      if (this.boxCollision(hitboxY, tile)) this.y = true;
    });

    this.tiles = [];
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
        x: pos.x + vel.x,
        y: pos.y + vel.y
      },
      {
        x: pos.x + vel.x,
        y: pos.y + vel.y + height
      },
      {
        x: pos.x + vel.x + width,
        y: pos.y + vel.y
      },
      {
        x: pos.x + vel.x + width,
        y: pos.y + vel.y + height
      }
    ];
  }
}


/*****************************
*
******************************/
class Tile {
  constructor(object) {
    this.x = object.x;
    this.y = object.y;
    this.width = object.width;
    this.height = object.height;
  }
}


/*****************************
*
******************************/
class Dynamic {
  constructor(object) {
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
      friction: -0.99,
      drag: -0.05
    };
  }

  apply(v) {
    let f = Vector.divide(v, this.mass);
    this.acceleration.add(f);
  }

  _gravity() {
    let f = new Vector(0, this.F.gravity * this.mass);
    return f;
  }

  _friction() {
    let f = this.velocity.clone();
    f.normalize();
    f.multiply(this.F.friction);
    return f;
  }

  _drag() {
    let f = this.velocity.clone();
    let speed = this.velocity.mag();
    f.normalize();
    f.multiply(this.F.drag * speed * speed);
    return f;
  }

  move(x, y) {
    let force = new Vector(x, y);
    this.apply(force);
  }

  jump(x, y) {
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
    this.apply(Vector.multiply(this._gravity(), 1));
    this.apply(Vector.multiply(this._friction(), 1));
    this.apply(Vector.multiply(this._drag(), 1));

    this.velocity.add((this.acceleration.multiply(dt)));

    // if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
    // if (Math.abs(this.velocity.y) < 0.1) this.velocity.y = 0;

    this.collision.update(this.position, Vector.multiply(this.velocity, dt), this.width, this.height);

    if (this.collision.hit('y')) this.velocity.set(this.velocity.x, 0);
    if (this.collision.hit('x')) this.velocity.set(0, this.velocity.y);

    this.position.add(this.velocity.multiply(dt));

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
