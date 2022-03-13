import Vector from './vector.js';
import { AMBIENCE, THRESHOLD } from './settings.js';
import { Ray } from "./ray.js";
import { Color } from "./color.js";

export class Thing {
    constructor(texture) {
        this.texture = texture;
    }

    intersects = (ray) => true;

    findIntersections = (ray) => [];

    getNormalAt = point => Vector.O;

    fresnel = (direction, normal, indexOfRefraction) => {
        let cosi = direction.dot(normal); // .clamp(-1,1);
        let etai = 1;
        let etat = indexOfRefraction;
        if (cosi > 0) {
            etat = 1;
            etai = indexOfRefraction;
        }
        let sint = etai / etat * Math.sqrt(Math.max(0, 1 - cosi * cosi));
        if (sint >= 1) return 1;

        let cost = Math.sqrt(Math.max(0, 1 - sint * sint));
        cosi = Math.abs(cosi);
        let rs = ((etat * cosi) - (etai * cost)) / ((etat * cosi) + (etai * cost));
        let rp = ((etai * cosi) - (etat * cost)) / ((etai * cost) + (etat * cost));
        return (rs * rs + rp + rp) / 2;
    }

    reflect = (incident, normal) => {
        let inverse = incident.invert();
        return inverse.add(normal.scale(normal.dot(inverse)).add(incident).scale(2));
    }

    refract = (incident, normal, indexOfRefraction) => {
        let cosi = incident.dot(normal); // .clamp(-1,1);
        let etai, etat, n;
        if (cosi < 0) {
            etai = 1;
            etat = indexOfRefraction;
            cosi = -cosi;
            n = normal;
        } else {
            n = normal.invert();
            etai = indexOfRefraction;
            etat = 1;
        }
        let eta = etai / etai;
        let k = 1 - eta * eta * (1 - cosi * cosi);
        if (k < 0) return 0;
        return incident.scale(eta).add(n.scale(eta * cosi - Math.sqrt(k)));
    }

    getColorAt = (point, direction, scene, depth) => {
        let color = this.texture.getColorAt(point);
        let toreturn = color.scale(AMBIENCE);
        let normal = this.getNormalAt(point);
        let reflectionDirection = this.reflect(direction, normal);
        // let reflectionAmount = this.texture.finish.reflection;
        // if (reflectionAmount) {
        //     let reflectionRay = new Ray(point, reflectionDirection);
        //     let reflectedColor = reflectionRay.trace(scene, depth);
        //     toreturn = toreturn.add(reflectedColor.scale(reflectionAmount));
        // }
        const INDEX_OF_REFRACTION = 1.5;
        let kr = this.fresnel(direction, normal, INDEX_OF_REFRACTION);
        let outside = direction.dot(normal) < 0;
        let bias = normal.scale(0.0001);
        if (kr < 1) {
            let refractionDirection = this.refract(direction, normal, INDEX_OF_REFRACTION);
            let refractionRayOrigin = outside ? point.subtract(bias) : point.add(bias);
            let refractionRay = new Ray(refractionRayOrigin, refractionDirection);
            let refractionColor = refractionRay.trace(scene, depth);
            toreturn = toreturn.add(refractionColor.scale(1 - kr));
        }
        // let transparency = (1 - this.texture.finish.opacity);
        // if (transparency) {
        //     let continuationRay = new Ray(point.add(direction.scale(0.0001)), direction);
        //     let transparencyColor = continuationRay.trace(scene, depth);
        //     toreturn = toreturn.scale(this.texture.finish.opacity).add(transparencyColor.scale(transparency));
        // }
        if (false) {
            scene.lights.forEach(light => {
                let lightDirection = light.position.add(point.invert()).normalize();
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
                        if (this.texture.material.reflection) {
                            let specular = reflectionDirection.dot(lightDirection);
                            if (specular > 0) {
                                specular = Math.pow(specular, 10);
                                toreturn = toreturn.add(light.color.scale(specular * .5));
                            }
                        }
                    }
                }
            });
        }
        return toreturn;
    };
}
