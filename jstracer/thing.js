import Vector from './vector.js';
import { AMBIENCE, THRESHOLD } from './settings.js';
import { Ray } from "./ray.js";

export class Thing {
    constructor(material) {
        this.material = material;
    }
    intersects = (ray) => true;
    findIntersections = (ray) => [];
    getNormalAt = point => Vector.O;
    getColorAt = (point, direction, scene) => {
        let color = this.material.getColorAt(point);
        let toreturn = color.scale(AMBIENCE);
        let normal = this.getNormalAt(point);
        scene.lights.forEach(light => {
            let lightDirection = light.position.add(point.invert().normalize());
            let cosangle = normal.dot(lightDirection);
            if (cosangle > 0) {
                let shadowed = false;
                let distance = light.position.add(point.invert());
                let shadowRay = new Ray(point, distance);
                distance = distance.length();
                for (var i = 0; i < scene.things.length && !shadowed; i++) {
                    var thing = scene.things[i];
                    if (thing == this)
                        continue;
                    if (thing.intersects(shadowRay)) {
                        let intersections = thing.findIntersections(shadowRay);
                        for (var j = 0; j < intersections.length; j++) {
                            if (intersections[j] > THRESHOLD) {
                                if (intersections[j] <= distance)
                                    shadowed = true;
                            }
                            break;
                        }
                    }
                }

                if (!shadowed) {
                    let lighting = color.multiply(light.color).scale(cosangle);
                    toreturn = toreturn.add(lighting);
                }
            }
        });
        return toreturn;
    };
}
