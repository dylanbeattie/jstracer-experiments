import { Thing } from './thing.js';

export default class Plane extends Thing {
    constructor(normal, distance, color) {
        super(color);
        this.normal = normal;
        this.distance = distance;
    }
    findIntersections = ray => {
        let a = ray.direction.dot(this.normal);
        if (a == 0) return [];
        let b = this.normal.dot(ray.start.add(this.normal.scale(this.distance).invert()));
        return [-b / a];
    };
    getNormalAt = _ => this.normal;
}
