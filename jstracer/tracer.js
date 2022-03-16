import Vector from './vector.js';
import { Scene } from './scene.js';
import { Camera } from './camera.js';

class RayTracer {
    ctx = null;
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    trace(scene, callback) {
        let xRes = this.width;
        let yRes = this.height;
        let row;
        const STEP = 1;
        for (let yPixel = 0; yPixel < yRes; yPixel += STEP) {
            row = new Uint8Array(xRes * 3);
            let index = 0;
            for (let xPixel = 0; xPixel < xRes; xPixel += STEP) {
                let x = (xPixel / xRes) - 0.5;
                let y = (yPixel / yRes) - 0.5;
                let pixelColor = scene.trace(x, y);
                row[index++] = Math.floor(pixelColor.r * 255);
                row[index++] = Math.floor(pixelColor.g * 255);
                row[index++] = Math.floor(pixelColor.b * 255);
                // this.ctx.fillStyle = color.toHexColor();
                // this.ctx.fillRect(xPixel, yPixel, STEP, STEP);
            }
            callback(yPixel, row, STEP);
        }
    }
}

export default RayTracer;