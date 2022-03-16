import Vector from './vector.js';

class Finish {
    constructor(options = {}) {
        this.ambient = options.ambient ?? 0.3;
        this.diffuse = options.diffuse ?? 0.7;
        this.reflection = options.reflection ?? 0;
        this.refraction = options.refraction ?? 1;
        this.opacity = options.opacity ?? 1;
    }
    static Default = new Finish();
}

class Texture {
    static ParseFinish(data) {
        return new Finish(data);
    }

    static ParsePigment(data = {}) {
        switch (data.pattern) {
            case "plain": return new Color(data.color);
            case "tiles": return new Tiles(new Color(data.color1), new Color(data.color2))
            default: return Color.Gray50;
        }
    }

    static Parse(data = {}) {
        let pigment = data.pigment ? Texture.ParsePigment(data.pigment) : Color.Gray50;
        let finish = data.finish ? Texture.ParseFinish(data.finish) : Finish.Default;
        return new Texture(pigment, finish);
    }
    constructor(pigment, finish) {
        this.material = pigment ?? Color.Gray50;
        this.finish = finish ?? Finish.Default;
    }
    getColorAt = point => this.material.getColorAt(point);
}

class Material {
    constructor() { }
    getColorAt = point => Color.Grey;
}

class MaterialMap {
    constructor(map) {
        this.map = map;
        this.keys = Object.keys(map).map(k => parseFloat(k));
        this.keys.sort((a, b) => a - b);
    }
    /** Get the color at a specified value between 0 and 1 */
    getColorAtValue = (value, point) => {
        if (this.map[value]) return (this.map[value].getColorAt(point));
        let lowerKey = this.keys.filter(k => k <= value).pop();
        let upperKey = this.keys.filter(k => k >= value).shift();
        // lowerKey = 0.2, upperKey = 0.7, value = 0.3, so value is at position 0.1 in the interval 0.0 => 0.5
        // so we need 80% of lower material mixed with 20% of upper material
        // so... we need position / interval (0.1 / 0.5) => 0.2
        // and then 1 - that
        let interval = upperKey - lowerKey;
        let position = value - lowerKey;
        let upperProportion = position / interval;
        let lowerProportion = 1 - upperProportion;
        let lowerColor = this.map[lowerKey].getColorAt(point);
        let upperColor = this.map[upperKey].getColorAt(point);
        return lowerColor.scale(lowerProportion).add(upperColor.scale(upperProportion));
    }
}

class Rings extends Material {
    constructor(map) {
        super();
        this.map = new MaterialMap(map);
    }
    getColorAt = point => {
        let value = Math.abs(Math.sqrt(point.x * point.x + point.z * point.z) % 1);
        return this.map.getColorAtValue(value, point);
    }
}

class Tiles extends Material {
    constructor(material1, material2) {
        super();
        this.material1 = material1;
        this.material2 = material2;
    }
    getColorAt = point => {
        let ax = Math.abs(Math.round(point.x) % 2);
        let ay = Math.abs(Math.round(point.y) % 2);
        let az = Math.abs(Math.round(point.z) % 2);
        if (ay == 0) {
            return (ax == az ? this.material1.getColorAt(point) : this.material2.getColorAt(point));
        } else {
            return (ax == az ? this.material2.getColorAt(point) : this.material1.getColorAt(point));
        }
    }
}

class Color extends Material {

    static FromHtml = str => {
        str = str.replace(/\s/g, ''); // Remove all spaces
        let cache;
        // Checks for 6 digit hex and converts string to integer
        if (cache = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(str)) cache = cache.slice(1).map(c => parseInt(c, 16));
        // Checks for 3 digit hex and converts string to integer
        else if (cache = /#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(str)) cache = cache.slice(1).map(c => parseInt(c, 16) * 17);
        // Checks for rgba and converts string to integer/float using unary + operator to save bytes
        else if (cache = /rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(str)) cache = [+cache[1], +cache[2], +cache[3], +cache[4]];
        // Checks for rgb and converts string to integer/float using unary + operator to save bytes
        else if (cache = /rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(str)) cache = [+cache[1], +cache[2], +cache[3]];
        else return null;

        // Performs RGBA conversion by default
        if (isNaN(cache[3])) cache[3] = 1;

        // Adds or removes 4th value based on rgba support
        // Support is flipped twice to prevent erros if
        // it's not defined
        return cache.map(c => c / 0xff);
    }

    getColorAt = _ => this;

    static White = new Color("#fff");
    static Black = new Color("#000");
    static Gray50 = new Color(0.5, 0.5, 0.5);
    static Red = new Color("rgba(255,0,0,0)");
    static Green = new Color("rgb(0,255,0)");
    static Blue = new Color(0, 0, 1);

    clamp = value => (value > 1 ? 1 : value < 0 ? 0 : value);

    constructor(r, g, b, a) {
        super();
        if (g == undefined) {
            let values = Array.isArray(r) ? r : Color.FromHtml(r);
            if (values) {
                this.r = values[0];
                this.g = values[1];
                this.b = values[2];
                this.a = values[3];
            }
        } else {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }

    clip = function () {
        let rr = this.r;
        let gg = this.g;
        let bb = this.b;
        var intensity = this.r + this.g + this.b;
        var overflow = intensity - 3;
        if (overflow > 0) {
            rr = rr + overflow * (rr / intensity);
            gg = gg + overflow * (gg / intensity);
            bb = bb + overflow * (bb / intensity);
        }
        return new Color(this.clamp(rr), this.clamp(gg), this.clamp(bb));
    }

    add = (that) => new Color(this.r + that.r, this.g + that.g, this.b + that.b);
    multiply = (that) => new Color(this.r * that.r, this.g * that.g, this.b * that.b);
    scale = (factor) => new Color(this.r * factor, this.g * factor, this.b * factor);
    hex = (value) => Math.floor(0xff * value).toString(16).padStart(2, '0');
    toHexColor = () => `#${this.hex(this.r)}${this.hex(this.g)}${this.hex(this.b)}`;
    toRgb = () => `rgb(${Math.floor(this.r * 0xff)},${Math.floor(this.g * 0xff)},${Math.floor(this.b * 0xff)})`;
    toRgba = () => `rgba(${Math.floor(this.r * 0xff)},${Math.floor(this.g * 0xff)},${Math.floor(this.b * 0xff)},${1 - this.a})`;
}

export { Tiles, Color, Rings, MaterialMap, Finish, Texture };