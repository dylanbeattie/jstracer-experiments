import Vector from './vector.js';
import { Ray } from './ray.js';

export class Camera {
    /** create a new camera
     * @param {Vector} location Where is this camera in your scene? Defaults to <0,0,-1>
     * @param {Vector} look_At what's the camera pointing at? Defaults to the origin <0,0,0>
     */
    constructor(location, look_at, width, height) {
        this.location = location ?? Vector.Z.invert();
        this.look_at = look_at ?? Vector.O;
        // Putting the camera directly above the focal point causes divide-by-zero errors, so we fudge it.
        if (this.location.x == this.look_at.x && this.location.z == this.look_at.z)
            this.location.z -= 0.000001;
        this.direction = this.look_at.subtract(this.location).normalize();
        this.right = Vector.Y.cross(this.direction).normalize().scale(width / 2);
        this.up = this.right.cross(this.direction).invert().normalize().scale(height / 2);
    }

    trace(scene, x, y) {
        let vx = this.right.scale(x);
        let vy = this.up.scale(y).invert();
        let r = this.direction.add(vx).add(vy);
        let ray = new Ray(this.location, r);
        return ray.trace(scene);
    }
}
export default Camera;