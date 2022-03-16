import Vector from './vector.js';
import * as Textures from './color.js';
import Sphere from './sphere.js';
import Plane from './plane.js';
import Light from './light.js';
import Camera from './camera.js';

export class Scene {

    static Parse(data) {
        let camera = new Camera(new Vector(data.camera.position), new Vector(0, 1, 0), 2, 1.5);
        let lights = data.lights.map(l => new Light(new Vector(l.position), new Textures.Color(l.color)));

        let glass = new Textures.Texture(
            new Textures.Color(0.9, 0.9, 1, 0.5),
            new Textures.Finish({ ambience: 0, diffuse: 0, opacity: 0, reflection: 0.5, refraction: 1.52 })
        );

        let chessboard = new Plane(new Vector(0, 1, 0), 0, new Textures.Texture(new Textures.Tiles(Textures.Color.Black, Textures.Color.White)));
        let glassBall = new Sphere(Vector.Y, 1, glass);
        let sky = new Sphere(Vector.O, 1000, new Textures.Texture(new Textures.Color(0.5, 0.6, 1), new Textures.Finish({ ambient: 1 })));
        let things = [
            chessboard, glassBall, sky
            // new Sphere(Vector.O, 100, new Textures.Texture(Textures.Color.Blue)),
            // new Plane(new Vector(0, 1, 0), 0, new Textures.Texture(Textures.Color.Green)),
            // new Sphere(Vector.O, 100, new Textures.Texture(Textures.Color.Black, new Textures.Finish({ reflection: 0 }))),
            // new Sphere(new Vector(-2, 1, 0), 1, new Textures.Texture(Textures.Color.White, new Textures.Finish({ reflection: 1 }))),
            // new Sphere(new Vector(0, 1, 0), 1, glass),
            // new Sphere(new Vector(-2, 1, 2), 1, new Textures.Texture(Textures.Color.White, new Textures.Finish({ opacity: 0.8, refraction: 1.2 }))),
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
            //
        ];
        return new Scene(camera, lights, things);
    }
    trace(x, y) {
        return this.camera.trace(this, x, y).clip();
    }
    constructor(camera, lights, things) {
        this.camera = camera;
        this.lights = lights ?? [];
        this.things = things ?? [];
    }
}
