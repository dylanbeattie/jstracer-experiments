import Vector from './vector.js';
import { Color, Chessboard } from './color.js';
import Sphere from './sphere.js';
import Light from './light.js';

export class Scene {
    constructor() {
        this.lights = [
            new Light(new Vector(5, 5, -1), new Color(0.1, 0.2, 0.3)),
            // new Light(new Vector(-5, 5, -1), new Color(1, 0, 0)),
            // new Light(new Vector(0, -2, 2), new Color(0, 1, 0))
        ];

        this.things = [
            new Sphere(new Vector(0, 0, 0), 10, new Chessboard(Color.Grey, Color.White))
            // new Sphere(new Vector(0, 0, 0), 1, new Color(1, 1, 1))
            // new Sphere(new Vector(-1, -1, 0), 0.1, new Color(1, 1, 0)),
            // new Sphere(new Vector(-1, 0, 0), 0.2, new Color(0, 0.5, 0)),
            // new Sphere(new Vector(-1, 1, 0), 0.3, new Color(0, 0, 0.5)),
            // new Sphere(new Vector(0, -1, 0), 0.4, new Color(1, 0, 0)),
            // new Sphere(new Vector(0, 0, 0), 0.5, new Color(1, 0, 0.5)),
            // new Sphere(new Vector(0, 1, 0), 0.5, new Color(0, 0.5, 0.5)),
            // new Sphere(new Vector(1, -1, 0), 0.5, new Color(1, 0, 1)),
            // new Sphere(new Vector(1, 0, 0), 0.5, new Color(0, 1, 0)),
            // new Sphere(new Vector(1, 1, 0), 0.5, new Color(1, 1, 1))
        ];
    }
}
