import { Color } from './color.js';
import { THRESHOLD } from './settings.js';

export class Ray {
    constructor(start, direction) {
        this.start = start;
        this.direction = direction.normalize();
    }
    trace(scene) {
        let distance = -1;
        let intersector = null;
        for (var i = 0; i < scene.things.length; i++) {
            let thing = scene.things[i];
            if (!thing.intersects(this))
                continue;
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
        var intersectionPoint = this.start.add(this.direction.scale(distance));
        return intersector.getColorAt(intersectionPoint, this.direction, scene);
    }
}
