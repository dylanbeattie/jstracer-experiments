import Vector from './vector.js';
import { Scene } from './scene.js';
import { Camera } from './camera.js';

class RayTracer {
    ctx = null;
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = new Camera(new Vector(-1, 1, -2), new Vector(0, 0, 0), 4, 3);
        this.scene = new Scene();
    }
    trace() {
        let xRes = this.canvas.width;
        let yRes = this.canvas.height;
        const STEP = 1;
        for (let xPixel = 0; xPixel < xRes; xPixel += STEP) {
            for (let yPixel = 0; yPixel < yRes; yPixel += STEP) {
                let x = (xPixel / xRes) - 0.5;
                let y = (yPixel / yRes) - 0.5;
                var color = this.camera.trace(this.scene, x, y).clip();
                this.ctx.fillStyle = color.toHexColor();
                this.ctx.fillRect(xPixel, yPixel, STEP, STEP);
            }
        }
    }
}

export default RayTracer;