import Vector from './vector.js';
import { Color, Chessboard } from './color.js';
import Sphere from './sphere.js';
import Plane from './plane.js';
import Light from './light.js';
import Camera from './camera.js';

export class Scene {
    trace(x, y) {
        return this.camera.trace(this, x, y).clip();
    }
    constructor() {
        this.camera = new Camera(new Vector(2, 1, -5), new Vector(0, 0, 0), 2, 1.5);
        this.lights = [
            new Light(new Vector(-7, 10, -10), Color.White),
            // new Light(new Vector(-5, 5, -1), new Color(1, 0, 0)),
            // new Light(new Vector(0, -2, 2), new Color(0, 1, 0))
        ];

        this.things = [
            new Sphere(Vector.O, 100, new Color(0, 1, 1, 0)),
            new Sphere(new Vector(-2, 0, 0), 1, new Color(1, 0, 0, 0.5)),
            new Sphere(new Vector(0, 0, 0), 1, new Color(0, 1, 0, 0.5)),
            new Sphere(new Vector(2, 0, 0), 1, new Color(0, 0, 1, 0.5)),
            // new Sphere(Vector.O, 1, new Color(.5, .25, .25, 1)),
            // new Sphere(new Vector(1, 0, 0), 1, new Color(.5, 1, .5, 1)),
            // new Sphere(new Vector(-1.5, 0, 0), 0.7, new Color(.5, 0.5, .1, 1)),
            //new Box(new Vector(-1, 0.5, -1), new Vector(1, 2.5, 1), new Color(1, 0, 1)),
            // new Plane(Vector.O, -1, new Color(.5, .5, 1, 2))
            new Plane(new Vector(0, 1, 0), -1, new Chessboard(Color.Black, Color.White)),
            // new Sphere(new Vector(0, 1, 0), 1, new Color(1, 1, 1, 0.5)),
            // new Sphere(new Vector(1, 0.1, -1), 0.1, new Color(1, 1, 0, 0.5)),
            // new Sphere(new Vector(0, 0.4, 0), 0.4, new Color(0.9, 0.4, 0.2, 0.5)),
            // new Sphere(new Vector(0, 0, 0), 10, new Chessboard(Color.Grey, Color.White)),
            // new Sphere(new Vector(0, 0, 0), 1, new Color(1, 1, 1, 0.5)),
            // new Sphere(new Vector(-1, 0, 0), 0.2, new Color(0, 0.5, 0, 0.5)),
            // new Sphere(new Vector(-1, 1, 0), 0.3, new Color(0, 0, 0.5, 0.5)),
            // new Sphere(new Vector(0, -1, 0), 0.4, new Color(1, 0, 0, 0.5)),
            // new Sphere(new Vector(0, 0, 0), 0.5, new Color(1, 0, 0.5, 0.5)),
            // new Sphere(new Vector(0, 1, 0), 0.5, new Color(0, 0.5, 0.5)),
            // new Sphere(new Vector(1, -1, 0), 0.5, new Color(1, 0, 1, 1)),
            // new Sphere(new Vector(1, 0, 0), 0.5, new Color(0, 1, 0, 1)),
            // new Sphere(new Vector(1, 1, 0), 0.5, new Color(1, 1, 1, 1))
        ];
    }
}
