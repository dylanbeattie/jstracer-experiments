import Vector from './vector.js';
import Color from './color.js';

const THRESHOLD = 0.00000001;

class Thing {
    constructor(color) {
        this.color = color;
    }
    intersects = (ray) => true;
    findIntersections = (ray) => [];
}

class Sphere extends Thing {
    constructor(center, radius, color) {
        super(color);
        this.center = center;
        this.radius = radius;
    }
    findIntersections = ray => {
        let a
            = Math.pow(ray.direction.x, 2)
            + Math.pow(ray.direction.y, 2)
            + Math.pow(ray.direction.z, 2);
        let b
            = 2 * (ray.start.x - this.center.x) * ray.direction.x
            + 2 * (ray.start.y - this.center.y) * ray.direction.y
            + 2 * (ray.start.z - this.center.z) * ray.direction.z;
        let c
            = Math.pow(ray.start.x - this.center.x, 2)
            + Math.pow(ray.start.y - this.center.y, 2)
            + Math.pow(ray.start.z - this.center.z, 2)
            - Math.pow(this.radius, 2);

        let discriminant = b * b - 4 * a * c;
        // If discriminant is negative, that means the ray never intersects the sphere.
        // (For math nerds: that means the quadratic equation has complex solutions!)
        if (discriminant < 0) return [];
        // If the discriminant is exactly zero, the ray touches the surface of the sphere 
        // but doesn't actually go through it, so there is only a single intersection.
        if (discriminant == 0) return [-b / (2 * a)];
        // Otherwise we have two intersections - one on the way in, one on the way out.
        return [
            (-b - Math.sqrt(discriminant)) / (2 * a),
            (-b + Math.sqrt(discriminant)) / (2 * a)
        ];
    }
}

class Scene {
    constructor() {
        this.things = [
            new Sphere(new Vector(0, -0.5, 0.1), 0.1, new Color(1, 0, 0)),
            new Sphere(new Vector(0, 0, 0), 0.1, new Color(0, 1, 0)),
            new Sphere(new Vector(0, 0.5, 0), 0.1, new Color(0, 0, 1))
        ];
    }
}
class Ray {
    constructor(start, direction) {
        this.start = start;
        this.direction = direction.normalize();
    }
    trace(scene) {
        let distance = -1;
        let intersector = null;
        for (var i = 0; i < scene.things.length; i++) {
            let thing = scene.things[i];
            if (!thing.intersects(this)) continue;
            let intersections = thing.findIntersections(this);
            for (var b = 0; b < intersections.length; b++) {
                if (intersections[b] > THRESHOLD) {
                    if (distance == -1 || intersections[b] < distance) {
                        distance = intersections[b];
                        intersector = thing;
                    }
                }
            }
        }
        if (distance == -1) return new Color(0, 0, 0);
        return intersector.color;
    }
}

class Camera {
    /** create a new camera
     * @param {Vector} location Where is this camera in your scene? Defaults to the origin <0,0,0>
     * @param {Vector} direction What direction is the camera pointing in? Defaults to looking straight along the positive Z axis.
     */
    constructor(location, direction, up, right) {
        this.location = location ?? Vector.O;
        this.direction = direction ?? Vector.Z;
        this.up = Vector.Y;
        this.right = Vector.X.scale(4 / 3);
    }

    trace(scene, x, y) {
        let vx = this.right.scale(x);
        let vy = this.up.scale(y);
        let r = this.direction.add(vx).add(vy);
        let ray = new Ray(this.location, r);
        return ray.trace(scene);
    }
}

class RayTracer {
    ctx = null;
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = new Camera(new Vector(0, 0, -2));
        this.scene = new Scene();
    }
    trace() {
        // console.log(`canvas size (logical pixels): ${this.canvas.width}x${this.canvas.height}`);
        // console.log(`canvas size (actual pixels): ${this.canvas.offsetWidth}x${this.canvas.offsetHeight}`);
        // console.log(Vector.X);
        // this.ctx.fillStyle = "#fff";
        // this.ctx.font = "10px sans-serif";
        // this.ctx.fillText('Canvas ready!', 5, 15);
        let xRes = this.canvas.width;
        let yRes = this.canvas.height;
        const STEP = 1;
        for (let xPixel = 0; xPixel < xRes; xPixel += STEP) {
            for (let yPixel = 0; yPixel < yRes; yPixel += STEP) {
                let x = (xPixel / xRes) - 0.5;
                let y = (yPixel / yRes) - 0.5;
                var color = this.camera.trace(this.scene, x, y);
                this.ctx.fillStyle = color.toHexColor();
                this.ctx.fillRect(xPixel, yPixel, STEP, STEP);
            }
        }
    }
}

export default RayTracer;