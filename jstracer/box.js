import { Thing } from './thing.js';
import { THRESHOLD } from './settings.js';
import Vector from './vector.js';

export default class Box extends Thing {
    constructor(corner1, corner2, color) {
        super(color);
        ['x', 'y', 'z'].forEach(k => {
            if (corner1[k] > corner2[k]) [corner1[k], corner2[k]] = [corner2[k], corner1[k]];
        });
        this.v1 = corner1;
        this.v2 = corner2;
    }

    contains = (point, dim) => point[dim] > this.v1[dim] && point[dim] < this.v2[dim];

    findints = (dimension, odim1, odim2, ray) => {
        let ints = new Array();
        if (ray.direction[dimension] == 0) return;
        let int1 = (this.v1[dimension] - ray.start[dimension]) / ray.direction[dimension];
        let int2 = (this.v2[dimension] - ray.start[dimension]) / ray.direction[dimension];
        let p1 = ray.start.add(ray.direction.scale(int1));
        let p2 = ray.start.add(ray.direction.scale(int2));
        if (this.contains(p1, odim1) && this.contains(p1, odim2)) ints.push(int1);
        if (this.contains(p2, odim1) && this.contains(p2, odim2)) ints.push(int2);
        return ints;
    }
    findIntersections = (ray) => {
        let ints = this.findints('x', 'y', 'z', ray)
            .concat(this.findints('y', 'x', 'z', ray))
            .concat(this.findints('z', 'x', 'y', ray));
        // console.log(ints);
        ints.sort();
        return ints;
    }
    getNormalAt = (pos) => {
        if (Math.abs(this.v1.x - pos.x) < THRESHOLD) return Vector.X.invert();
        if (Math.abs(this.v2.x - pos.x) < THRESHOLD) return Vector.X;
        if (Math.abs(this.v1.y - pos.y) < THRESHOLD) return Vector.Y.invert();
        if (Math.abs(this.v2.y - pos.y) < THRESHOLD) return Vector.Y;
        if (Math.abs(this.v1.z - pos.z) < THRESHOLD) return Vector.Z.invert();
        if (Math.abs(this.v2.z - pos.z) < THRESHOLD) return Vector.Z;
    }
    toString = () => `Box from ${this.v1.toString()} to ${this.v2.toString()}`;
}
