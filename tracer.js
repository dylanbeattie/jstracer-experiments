const PRECISION = .00000001;

class Vector {
    constructor(x, y, z) {
        this.x = x; this.y = y; this.z = z;
    }
    toString() { return '<' + this.x + ',' + this.y + ',' + this.z + '>'; }
    neg() { return new Vector(-this.x, -this.y, -this.z); }
    transform(transformation) {
        this.x = this.dot(transformation.vx) + transformation.c.x;
        this.y = this.dot(transformation.vy) + transformation.c.y;
        this.z = this.dot(transformation.vz) + transformation.c.z;
    }
    length() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    normalize() { l = this.length(); return new Vector(this.x / l, this.y / l, this.z / l); }
    dot(that) { return this.x * that.x + this.y * that.y + this.z * that.z };
    cross(that) {
        xx = v1.y * v2.z - v1.z * v2.y;
        yy = v1.z * v2.x - v1.x * v2.z;
        zz = v1.x * v2.y - v1.y * v2.x;
        return new Vector(xx, yy, zz);
    }
    add(that) {
        return new Vector(this.x + that.x, this.y + that.y, this.z + that.z);
    }
    scalar(s) {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }
    static X = new Vector(1, 0, 0);
    static Y = new Vector(0, 1, 0);
    static Z = new Vector(0, 0, 1);
    static O = new Vector(0, 0, 0);
}

class Transformation {
    constructor(vx, vy, vz, c) {
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.c = c;
    }
}

class Color {
    constructor(red, green, blue, special) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.special = special;
    }
    clip() {
        alllight = this.red + this.green + this.blue;
        excesslight = alllight - 3;
        if (excesslight > 0) {
            this.red = this.red + excesslight * (this.red / (alllight));
            this.green = this.green + excesslight * (this.green / (alllight));
            this.blue = this.blue + excesslight * (this.blue / (alllight));
        }
        if (this.red > 1) this.red = 1;
        if (this.green > 1) this.green = 1;
        if (this.blue > 1) this.blue = 1;
        if (this.red < 0) this.red = 0;
        if (this.green < 0) this.green = 0;
        if (this.blue < 0) this.blue = 0;
    }
    brightness() { return (this.red + this.green + this.blue) / 3; }
    multiply(that) {
        return new Color(this.red * that.red, this.green * that.green, this.blue * that.blue);
    }
    scale(s) {
        return new Color(this.red * s, this.green * s, this.blue * s);
    }
    add(that) {
        return new Color(this.red + that.red, this.green + that.green, this.blue + that.blue);
    }
}

function Camera(loc, dir, right, down, sky) {
    if (!loc) loc = O;
    if (!dir) dir = Z;
    if (!right) right = X;
    if (!down) down = Y.neg();
    this.loc = loc;
    this.dir = dir;
    this.right = right;
    this.down = down;
}
Camera.prototype.trace = function (objectlist, lightlist, xamnt, yamnt) {
    var ray = new Ray(
        this.loc,
        vadd(vadd(this.dir, vscalar(this.right, (xamnt - .5))), vscalar(this.down, (yamnt - .5)))
    );
    return ray.trace(objectlist, lightlist);
}

function LightSource(pos, color) {
    this.pos = pos;
    this.col = color;
}

function Obj() {
    // all 3d objects are "subclasses" of this
}
Obj.prototype.getColorAt = function (pos, dir, objs, lights) {
    if (this.col.special == 2) {
        square = Math.floor(pos.x) + Math.floor(pos.z);
        this.col.red = this.col.green = this.col.blue = (square / 2 == Math.floor(square / 2));
    }
    toreturn = colscalar(this.col, ambientlight);
    normal = this.getNormalAt(pos);
    if (this.col.special > 0 && this.col.special <= 1) {
        reflectiondir = vadd(dir.neg(), vscalar(vadd(vscalar(normal, vdot(normal, dir.neg())), dir), 2));
        reflectionray = new Ray(pos, reflectiondir);
        toreturn = coladd(toreturn, colscalar(reflectionray.trace(objs, lights), this.col.special));
    }
    for (var a = 0; a < lights.length; a++) {
        lightdir = vadd(lights[a].pos, pos.neg()).normalize();
        cosangle = vdot(normal, lightdir);
        if (cosangle > 0) {
            // test for shadow
            shadowed = false;
            dist = vadd(lights[a].pos, pos.neg());
            shadowray = new Ray(pos, vadd(lights[a].pos, pos.neg()));
            dist = dist.length();
            for (var b = 0; b < objs.length && !shadowed; b++) {
                if (objs[b] != this && objs[b].boundtest(shadowray)) {
                    intersections = objs[b].findintersections(shadowray);
                    for (var c = 0; c < intersections.length; c++) {
                        if (intersections[c] > PRECISION) {
                            if (intersections[c] <= dist) {
                                shadowed = true;
                            }
                            break;
                        }
                    }
                }
            }
            if (!shadowed) {
                toreturn = coladd(toreturn, colscalar(colmult(this.col, lights[a].col), cosangle));
                if (this.col.special > 0 && this.col.special <= 1) {
                    specular = vdot(reflectiondir, lightdir);
                    if (specular > 0) {
                        specular = Math.pow(specular, 10);
                        toreturn = coladd(toreturn, colscalar(lights[a].col, specular * .6));
                    }
                }
            }
        }
    }
    //window.status = window.status + toreturn;
    return toreturn;
}
Obj.prototype.boundtest = function (ray) {
    return true;
}

function Box(v1, v2, color) {
    this.v1 = v1;
    this.v2 = v2;
    if (this.v1.x > this.v2.x) {
        temp = this.v1.x;
        this.v1.x = this.v2.x;
        this.v2.x = temp;
    }
    if (this.v1.y > this.v2.y) {
        temp = this.v1.y;
        this.v1.y = this.v2.y;
        this.v2.y = temp;
    }
    if (this.v1.z > this.v2.z) {
        temp = this.v1.z;
        this.v1.z = this.v2.z;
        this.v2.z = temp;
    }
    this.col = color;
    this.boundedby = this;
}
Box.prototype = new Obj();
Box.findints = function (ints, v1, v2, dim, odim1, odim2, s, d) {
    if (d[dim] == 0) return;
    int1 = (v1[dim] - s[dim]) / d[dim];
    int2 = (v2[dim] - s[dim]) / d[dim];
    intpoint1 = vadd(s, vscalar(d, int1));
    intpoint2 = vadd(s, vscalar(d, int2));
    if (intpoint1[odim1] > v1[odim1] && intpoint1[odim1] < v2[odim1] && intpoint1[odim2] > v1[odim2] && intpoint1[odim2] < v2[odim2]) {
        ints[ints.length] = int1;
    }
    if (intpoint2[odim1] > v1[odim1] && intpoint2[odim1] < v2[odim1] && intpoint2[odim2] > v1[odim2] && intpoint2[odim2] < v2[odim2]) {
        ints[ints.length] = int2;
    }
}
Box.prototype.findintersections = function (ray) {
    ints = new Array();
    Box.findints(ints, this.v1, this.v2, 'x', 'y', 'z', ray.start, ray.dir);
    Box.findints(ints, this.v1, this.v2, 'y', 'x', 'z', ray.start, ray.dir);
    Box.findints(ints, this.v1, this.v2, 'z', 'x', 'y', ray.start, ray.dir);
    ints.sort();
    return ints;
}
Box.prototype.getNormalAt = function (pos) {
    if (Math.abs(this.v1.x - pos.x) < PRECISION) return X.neg();
    if (Math.abs(this.v2.x - pos.x) < PRECISION) return X;
    if (Math.abs(this.v1.y - pos.y) < PRECISION) return Y.neg();
    if (Math.abs(this.v2.y - pos.y) < PRECISION) return Y;
    if (Math.abs(this.v1.z - pos.z) < PRECISION) return Z.neg();
    if (Math.abs(this.v2.z - pos.z) < PRECISION) return Z;
}

function Plane(normal, dist, color) {
    this.norm = normal.normalize();
    this.dist = dist;
    this.col = color;
}
Plane.prototype = new Obj();
Plane.prototype.boundtest = function () { return true; };
Plane.prototype.findintersections = function (ray) {
    if (vdot(ray.dir, this.norm) == 0) return [];
    a = vdot(ray.dir, this.norm);
    b = vdot(this.norm, vadd(ray.start, vscalar(this.norm, this.dist).neg()));
    return [-b / a];
}
Plane.prototype.getNormalAt = function () { return this.norm; }

function Sphere(pos, rad, color) {
    this.pos = pos;
    this.rad = rad;
    this.col = color;
    this.boundedby = new Box(new Vector(-rad, -rad, -rad), new Vector(rad, rad, rad));
}
Sphere.prototype = new Obj();
Sphere.prototype.findintersections = function (ray) {
    a = Math.pow(ray.dir.x, 2) + Math.pow(ray.dir.y, 2) + Math.pow(ray.dir.z, 2);
    b = 2 * (ray.start.x - this.pos.x) * ray.dir.x + 2 * (ray.start.y - this.pos.y) * ray.dir.y + 2 * (ray.start.z - this.pos.z) * ray.dir.z;
    c = Math.pow(ray.start.x - this.pos.x, 2) + Math.pow(ray.start.y - this.pos.y, 2) + Math.pow(ray.start.z - this.pos.z, 2) - this.rad * this.rad;
    discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return [];
    if (discriminant == 0) return [-b / (2 * a)];
    return [(-b - Math.sqrt(discriminant)) / (2 * a), (Math.sqrt(discriminant) - b) / (2 * a)];
};
Sphere.prototype.getNormalAt = function (pos) {
    return vadd(pos, this.pos.neg()).normalize();
}


var xres = 60; yres = 60;
var ambientlight = .2;
var aathreshold = .1, aadepth = 3;

function getpixelcolor(cam, objects, lights, xpos, ypos, texts, colors, aaed, forceAA) {
    var thisone = ypos * xres + xpos;
    aaed[thisone] = false;

    if (!forceAA) {
        colors[thisone] = cam.trace(objects, lights, (xpos + .5) / xres, (ypos + .5) / yres);
        colors[thisone].clip();

        if (ypos > 0 && Math.abs(colors[thisone].brightness() - colors[thisone - xres].brightness()) >= aathreshold) {
            if (!aaed[thisone - xres]) getpixelcolor(cam, objects, lights, xpos, ypos - 1, texts, colors, aaed, true);
            forceAA = true;
        }
        if (xpos > 0 && Math.abs(colors[thisone].brightness() - colors[thisone - 1].brightness()) >= aathreshold) {
            if (!aaed[thisone - 1]) getpixelcolor(cam, objects, lights, xpos - 1, ypos, texts, colors, aaed, true);
            forceAA = true;
        }
    }
    texts[thisone] = colors[thisone] + '"> ';
    if (xpos == xres - 1) texts[thisone] += '\n';

    //delete colors[thisone]; delete texts[thisone]; delete aaed[thisone];
}

function raytrace() {
    var campos = new Vector(eval(document.controls.camx.value), eval(document.controls.camy.value), eval(document.controls.camz.value));
    var camdir = campos.neg().normalize();
    var camright = vcross(Y, camdir).normalize();
    var camdown = vcross(camright, camdir);

    let cam = new Camera(campos, camdir, camright, camdown);
    let objects = [
        new Sphere(O, 1, new Color(1 * .5, .5 * .5, .5 * .5, .5))
        //,new Box(new Vector(-.3,-.5,3), new Vector(-1,-1,1), new Color(1,1,1))
        , new Plane(Y, -1, new Color(.5, .5, 1, 2))
        //,new Sphere(new Vector(1,0,3),1, new Color(.5,1,.5))
    ];
    let lights = [
        new LightSource(new Vector(-7, 10, -10), colscalar(new Color(1, 1, 1), 1))
        //,new LightSource(new Vector(5,20,-20), colscalar(new Color(.1,1,.1),.7))
    ];

    colors = new Array(xres * yres);
    aaed = new Array(xres * yres);
    temp = -10;
    //document.body.innerHTML = '<pre>';
    for (var ypos = 0; ypos < yres; ypos++) {
        for (var xpos = 0; xpos < xres; xpos++) {
            var thisone = ypos * xres + xpos;
            getpixelcolor(cam, objects, lights, xpos, ypos, texts, colors, aaed, false);
            //document.body.innerHTML += '<span style="background:' + texts[xpos+ypos*xres] + '</span>';
        }
        if (ypos <= temp) alert('WTF');
        temp = ypos;
        window.status = Math.round(ypos / yres * 100) + '%';
    }
    //document.body.innerHTML += '</pre>';
    window.status = '';
    document.getElementById('rendered').innerHTML = '<pre id="display"><span style="background:' + texts.join('</span><span style="background:') + '</span></pre>';
}
