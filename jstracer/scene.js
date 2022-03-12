import Vector from './vector.js';
import * as Textures from './color.js';
import Sphere from './sphere.js';
import Plane from './plane.js';
import Light from './light.js';
import Camera from './camera.js';

export class Scene {
    trace(x, y) {
        return this.camera.trace(this, x, y).clip();
    }
    constructor() {
        this.camera = new Camera(new Vector(2, 2, -5), new Vector(0, 1, 0), 2, 1.5);
        this.lights = [
            new Light(new Vector(-10, 10, -10), Textures.Color.Red),
            new Light(new Vector(0, 10, -10), Textures.Color.Green),
            new Light(new Vector(10, 10, -10), Textures.Color.Blue)
        ];

        this.things = [
            new Sphere(Vector.O, 100, new Textures.Texture(Textures.Color.Black, new Textures.Finish({ reflection: 0 }))),
            new Sphere(new Vector(-2, 1, 0), 1, new Textures.Texture(Textures.Color.White, new Textures.Finish({ reflection: 1 }))),
            //            new Sphere(new Vector(0, 1, 0), 1, new Color(0, 1, 0, 0.5)),
            // new Sphere(new Vector(0, 1, 0), 1, new Rings({
            //     0: Color.Black,
            //     0.1: Color.White,
            //     0.2: Color.Black,
            //     0.3: Color.White,
            //     0.4: new Color(0.5, 0.5, 0.5, 0.9),
            //     1: new Color(0.5, 0.5, 0.5, 0.9),
            //     //0.9: Color.Green,
            //     //1: Color.Red
            // })),
            //     new Sphere(new Vector(2, 1, 0), 1, new Color(0, 0, 1, 0.5)),
            new Plane(new Vector(0, 1, 0), 0, new Textures.Texture(new Textures.Tiles(Textures.Color.Black, Textures.Color.White)))
        ];
    }
}
