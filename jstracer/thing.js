import Vector from './vector.js';
import { AMBIENCE, THRESHOLD } from './settings.js';
import { Ray } from "./ray.js";
import { Color, Texture } from "./color.js";

export class Thing {
    constructor(texture) {
        this.texture = texture ?? new Texture();
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
        // debugger;
        let cosi = incident.dot(normal);
        if (cosi < -1) cosi = -1;
        if (cosi > 1) cosi = 1;
        let etai = 1, etat, n;
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
        let eta = etai / etat;
        let k = 1 - eta * eta * (1 - cosi * cosi);
        if (k < 0) return 0;
        let addition = n.scale(eta * cosi - Math.sqrt(k));
        return incident.scale(eta).add(addition);
    }

    getColorAt = (point, direction, scene, depth) => {
        let color = this.texture.getColorAt(point);
        let toreturn = color.scale(this.texture.finish.ambient);
        let normal = this.getNormalAt(point);
        let reflectionDirection = this.reflect(direction, normal);
        let transparent = this.texture.material.a;
        let reflective = (this.texture.finish.reflection);
        // if (transparent || reflective) {
        //     // if (transparent) {
        //     //     let continuationRay = new Ray(point.add(direction.scale(0.0001)), direction);
        //     //     let transparencyColor = continuationRay.trace(scene, depth);
        //     //     toreturn = toreturn.scale(this.texture.finish.opacity).add(transparencyColor.scale(transparent));
        //     // }

        let reflectionAmount = this.texture.finish.reflection;
        if (reflectionAmount) {
            let reflectionRay = new Ray(point, reflectionDirection);
            let reflectedColor = reflectionRay.trace(scene, depth);
            toreturn = toreturn.add(reflectedColor.scale(reflectionAmount));
        }
        //     let kr = this.fresnel(direction, normal, this.texture.finish.refraction);
        //     let outside = direction.dot(normal) < 0;
        //     let bias = normal.scale(0.0001);
        //     if (kr < 1) {
        //         let refractionDirection = this.refract(direction, normal, this.texture.finish.refraction);
        //         let refractionRayOrigin = outside ? point.subtract(bias) : point.add(bias);
        //         let refractionRay = new Ray(refractionRayOrigin, refractionDirection);
        //         let refractionColor = refractionRay.trace(scene, depth);
        //         toreturn = toreturn.add(refractionColor).scale(1 - kr);

        //         let reflectionRayOrigin = outside ? point.add(bias) : point.subtract(bias);
        //         let reflectionRay = new Ray(reflectionRayOrigin, reflectionDirection);
        //         let reflectionColor = reflectionRay.trace(scene, depth);
        //         toreturn = toreturn.add(reflectionColor.scale(kr));
        //     }
        // } else
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
                    toreturn = toreturn.add(lighting.scale(this.texture.finish.diffuse));
                    if (this.texture.finish.specular) {
                        let specular = reflectionDirection.dot(lightDirection);
                        if (specular > 0) {
                            specular = Math.pow(specular, 10);
                            toreturn = toreturn.add(light.color.scale(specular * this.texture.finish.specular));
                        }
                    }
                }
            }
        });
        return toreturn;
    };
}
